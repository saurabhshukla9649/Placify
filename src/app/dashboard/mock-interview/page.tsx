"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { conductMockInterview } from "@/ai/flows/conduct-mock-interview";
import { MessageSquare, User, Bot, Loader2, RefreshCw, Trophy, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UiverseChatInput } from "@/components/ui/uiverse-chat-input";

type Message = {
  role: "user" | "model";
  content: string;
};

// ==========================================
// 🧠 HUMAN-LIKE AI PERSONALITY
// ==========================================

function generateHumanTone(question: string) {
  const styles = [
    `Alright. ${question}`,
    `Great! Here's your next question: ${question}`,
    `Take a moment and think about this — ${question}`,
    `Interesting one for you: ${question}`,
    `Let's dive into this. ${question}`
  ];
  return styles[Math.floor(Math.random() * styles.length)];
}

// ==========================================
// 🧠 SMART EMOTION-BASED FEEDBACK
// ==========================================

function generateSmartFeedback(answer: string) {
  let emotion = "neutral";

  if (answer.length > 60) {
    emotion = "confident";
  } else if (answer.toLowerCase().includes("maybe") || answer.toLowerCase().includes("uh")) {
    emotion = "nervous";
  } else if (answer.length < 20) {
    emotion = "unclear";
  }

  if (emotion === "confident") {
    return "That was a confident answer 😎. Great job! Try adding a bit more structure to make it even stronger.";
  }

  if (emotion === "nervous") {
    return "I noticed a bit of hesitation 😅. Try to stay calm and speak more clearly. You’ve got this!";
  }

  if (emotion === "unclear") {
    return "Your answer was a bit short 🤔. Try to explain your thoughts in more detail with examples.";
  }

  return "Good attempt 👍. Try to improve clarity and structure.";
}

export default function MockInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechStartTimeRef = useRef<number | null>(null);
  const isVoiceUsedRef = useRef<boolean>(false);
  const currentWpmRef = useRef<number | undefined>(undefined);
  
  const { toast } = useToast();

  const stateRefs = useRef({ 
    input, 
    sendMessage: () => {} 
  });

  useEffect(() => {
    stateRefs.current.input = input;
  }, [input]);

  useEffect(() => {
    if (isRecording) {
      document.body.classList.add("mic-active");
    } else {
      document.body.classList.remove("mic-active");
    }
    return () => document.body.classList.remove("mic-active");
  }, [isRecording]);

  useEffect(() => {
    // Initialize SpeechRecognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput((prev) => (prev ? prev + " " + finalTranscript : finalTranscript).trim());
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access in your browser settings.",
              variant: "destructive",
            });
          } else if (event.error !== 'no-speech') {
            toast({
              title: "Microphone Error",
              description: `Speech recognition error: ${event.error}`,
              variant: "destructive",
            });
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          if (speechStartTimeRef.current && isVoiceUsedRef.current) {
            const durationMinutes = (Date.now() - speechStartTimeRef.current) / 60000;
            const words = stateRefs.current.input.trim().split(/\s+/).length;
            currentWpmRef.current = words / Math.max(durationMinutes, 0.01);
            // Trigger auto send
            if (stateRefs.current.input.trim()) {
              setTimeout(() => {
                stateRefs.current.sendMessage();
              }, 500);
            }
          }
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [toast]);



  const toggleRecording = async () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        setInput("");
        isVoiceUsedRef.current = true;
        speechStartTimeRef.current = Date.now();
        
        recognition.start();
        setIsRecording(true);
      } catch (err: any) {
        console.error("Microphone permission denied:", err);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser to use the voice feature.",
          variant: "destructive",
        });
      }
    }
  };

  const speakText = (text: string) => {
    if (!isTtsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    document.body.classList.remove("ai-speaking");
    window.speechSynthesis.cancel();
    
    // Remove markdown symbols (asterisks, etc.) before speaking
    // Add small pause effect (makes it feel natural)
    const cleanText = text.replace(/[*_#]/g, '').replace(/,/g, ", ").replace(/\./g, ". "); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    let voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(voice =>
      voice.name.includes("Google UK English Female") ||
      voice.name.includes("Google US English") ||
      voice.name.includes("Microsoft Zira") ||
      voice.name.includes("Microsoft Aria") ||
      voice.name.includes("Microsoft Jenny")
    );

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    document.body.classList.add("ai-speaking");
    utterance.onend = () => {
      document.body.classList.remove("ai-speaking");
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Load voices in background
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startInterview = async () => {
    if (!jobRole.trim()) {
      toast({
        title: "Role Required",
        description: "Please specify the job role you want to practice for.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsStarted(true);
    try {
      const result = await conductMockInterview({
        jobRole,
        history: [],
      });
      setMessages([{ role: "model", content: result.response }]);
      speakText(result.response);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Interview Error",
        description: error.message || "Could not start the interview. Please try again.",
        variant: "destructive",
      });
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || isEnd) return;

    const userMsg: Message = { role: "user", content: input };
    const nextMessagesHistory = [...messages, userMsg];
    
    // Inject Smart Feedback immediately locally
    const feedbackText = generateSmartFeedback(input);
    const feedbackMsg: Message = { role: "model", content: feedbackText };
    const newMessages = [...messages, userMsg, feedbackMsg];
    
    const usedVoice = isVoiceUsedRef.current;
    const wpm = currentWpmRef.current;
    
    setMessages(newMessages);
    speakText("Let me give you feedback based on your response. " + feedbackText);

    setInput("");
    isVoiceUsedRef.current = false;
    currentWpmRef.current = undefined;
    setIsLoading(true);

    try {
      const result = await conductMockInterview({
        jobRole,
        history: nextMessagesHistory, // Only send real chat history to AI
        ...(usedVoice ? { isVoiceUsed: true, wpm } : {})
      });
      
      let aiText = result.response;
      if (!result.isEnd) {
         aiText = generateHumanTone(aiText);
      }

      setMessages([...newMessages, { role: "model", content: aiText }]);
      setTimeout(() => {
        // give the local feedback some time before speaking this one, though queueing natively is better
        // but speakText cancels existing utterances. So we just let speakText run right after a slight local delay
        // Actually, to avoid interrupting the initial feedback speech, we can let user read it, and then it speaks AI.
        speakText(aiText);
      }, 500); // the local fetch usually takes 2-4 seconds anyway!

      if (result.isEnd) setIsEnd(true);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: error.message || "AI is having trouble responding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setIsStarted(false);
    setIsEnd(false);
    setJobRole("");
    window.speechSynthesis.cancel();
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    stateRefs.current.sendMessage = sendMessage;
  }, [sendMessage]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">AI Mock Interview</h1>
          <p className="text-gray-400 mt-2">Practice your interview skills with real-time AI feedback.</p>
        </div>
        {isStarted && (
          <Button variant="outline" size="sm" onClick={resetInterview} className="rounded-full glass border-white/10 text-gray-300 hover:text-white transition-all shrink-0">
            <RefreshCw className="mr-2 h-4 w-4" /> New Session
          </Button>
        )}
      </header>

      {!isStarted ? (
        <div className="liquid-glass-card max-w-xl mx-auto mt-12 rounded-3xl p-10 relative overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-700 pointer-events-none"></div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-headline font-bold text-white mb-3 tracking-tight">Interview Setup</h2>
            <p className="text-sm text-gray-400">Define your target role to start a tailored interview simulation with the AI Hiring Manager.</p>
          </div>
          
          <div className="space-y-8 relative z-10">
            <div className="space-y-4 flex flex-col">
              <label className="text-sm font-bold uppercase tracking-widest text-primary text-[11px] drop-shadow-[0_0_5px_rgba(0,174,239,0.5)]">What role are you interviewing for?</label>
              <div className="relative w-full">
                 <UiverseChatInput 
                  placeholder="e.g. Senior Frontend Developer" 
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startInterview()}
                  disabled={isLoading}
                  onSendAction={startInterview}
                  containerClassName="h-16 w-full shadow-lg"
                />
              </div>
            </div>
            
            <Button 
              className="w-full h-14 text-base font-bold bg-primary text-black hover:bg-white hover:text-primary neon-glow transition-all duration-300 rounded-xl mt-4 shadow-[0_0_20px_rgba(0,174,239,0.4)]" 
              onClick={startInterview} 
              disabled={isLoading || !jobRole.trim()}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MessageSquare className="mr-2 h-5 w-5" />}
              Start Simulation
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 liquid-glass-card rounded-3xl border border-white/10 overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>
          
          {/* Pulsing AI Energy Field during interview */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none -z-10 transition-all duration-[3000ms] ease-in-out ${isLoading ? "bg-primary/20 scale-110" : "bg-primary/5 scale-100"}`}></div>
          
          {/* Chat Header */}
          <div className="p-5 border-b border-white/5 bg-black/20 flex items-center justify-between backdrop-blur-xl relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-black/60 flex items-center justify-center text-primary border border-primary/40 shadow-[0_0_20px_rgba(0,174,239,0.4)] relative group overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                <div className={`absolute inset-0 bg-primary/30 blur-xl transition-opacity duration-500 ${isLoading ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                <Bot className="h-7 w-7 relative z-10 drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]" />
              </div>
              <div>
                <p className="text-lg font-bold text-white tracking-wide">AI Hiring Manager</p>
                <p className="text-xs text-gray-400 mt-0.5">Target Role: <span className="text-primary font-bold tracking-wider">{jobRole}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setIsTtsEnabled(!isTtsEnabled);
                  if (isTtsEnabled) window.speechSynthesis.cancel();
                }}
                className={`shrink-0 rounded-xl transition-all ${isTtsEnabled ? 'text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary shadow-[0_0_15px_rgba(0,174,239,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/10 border border-transparent'}`}
                title={isTtsEnabled ? "Disable AI Voice" : "Enable AI Voice"}
              >
                {isTtsEnabled ? <Volume2 className="h-5 w-5 drop-shadow-[0_0_5px_rgba(0,174,239,0.8)]" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              {isEnd && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Trophy className="mr-2 h-4 w-4" /> Concluded
                </span>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 overflow-y-auto as-scrollbar relative z-10" ref={scrollRef}>
            <div className="space-y-8 max-w-4xl mx-auto py-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    
                    <div className={`h-10 w-10 shrink-0 flex items-center justify-center mt-auto mb-1 rounded-2xl relative shadow-lg ${
                      msg.role === "user" 
                        ? "bg-gradient-to-tr from-purple-600 to-indigo-500 text-white border-2 border-white/10" 
                        : "bg-black/80 text-primary border-2 border-primary/40 shadow-[0_0_15px_rgba(0,174,239,0.3)]"
                    }`}>
                      {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 drop-shadow-[0_0_5px_rgba(0,174,239,0.8)]" />}
                    </div>

                    <div className={`p-5 text-[15px] leading-relaxed shadow-lg backdrop-blur-md relative ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-primary/30 to-purple-600/20 text-white rounded-[24px] rounded-br-sm border border-white/20" 
                        : "bg-black/40 text-gray-200 rounded-[24px] rounded-bl-sm border border-primary/20 shadow-[0_4px_30px_rgba(0,174,239,0.1)] whitespace-pre-wrap"
                    }`}>
                      {/* Inner glow for AI bubble */}
                      {msg.role === "model" && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-[24px] rounded-bl-sm pointer-events-none"></div>}
                      <div className="relative z-10">{msg.content}</div>
                    </div>

                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex gap-4 max-w-[85%]">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-black/80 text-primary border-2 border-primary/40 flex items-center justify-center mt-auto mb-1 shadow-[0_0_15px_rgba(0,174,239,0.3)]">
                      <Bot className="h-5 w-5 drop-shadow-[0_0_5px_rgba(0,174,239,0.8)]" />
                    </div>
                    <div className="bg-black/40 p-5 rounded-[24px] rounded-bl-sm border border-primary/20 shadow-[0_4px_30px_rgba(0,174,239,0.1)] flex items-center gap-2 h-16 backdrop-blur-md">
                      <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce shadow-[0_0_8px_rgba(0,174,239,0.8)] [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce shadow-[0_0_8px_rgba(0,174,239,0.8)] [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce shadow-[0_0_8px_rgba(0,174,239,0.8)]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-white/5 bg-black/30 backdrop-blur-xl mb-2 relative z-10">
            <div className="max-w-4xl mx-auto relative z-10 w-full">
              {isRecording && <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2 tracking-wider"><span className="w-2 h-2 rounded-full bg-red-500"></span> RECORDING</div>}
              <UiverseChatInput 
                placeholder={
                  isRecording 
                    ? "Listening... Speak your answer loudly and clearly" 
                    : isEnd 
                      ? "Session concluded. Review your feedback above." 
                      : "Type or speak your response..."
                }
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  isVoiceUsedRef.current = false;
                }}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading || isEnd}
                onSendAction={sendMessage}
                onMicToggle={toggleRecording}
                isRecording={isRecording}
                containerClassName="w-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
