"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Bot, Loader2, Play, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UiverseChatInput } from "@/components/ui/uiverse-chat-input";
import { chatMentor } from "@/ai/flows/chat-mentor";

function generateHumanTone(text: string) {
  const styles = [
    `Alright. ${text}`,
    `Great point. ${text}`,
    `Take a moment to consider this — ${text}`,
    `Interesting perspective: ${text}`,
    `Let's dive into this. ${text}`
  ];
  return styles[Math.floor(Math.random() * styles.length)];
}

type Message = {
  role: "user" | "model";
  content: string;
};

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Hello! I am your Placify AI Mentor. I'm here to help you navigate your career path, recommend resources, and answer any professional development questions you have. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isVoiceUsedRef = useRef<boolean>(false);
  
  const { toast } = useToast();

  const stateRefs = useRef({ 
    input, 
    sendMessage: () => {} 
  });

  useEffect(() => {
    stateRefs.current.input = input;
  }, [input]);

  useEffect(() => {
    stateRefs.current.sendMessage = sendMessage;
  }, [messages, input]);

  useEffect(() => {
    if (isRecording) {
      document.body.classList.add("mic-active");
    } else {
      document.body.classList.remove("mic-active");
    }
    return () => document.body.classList.remove("mic-active");
  }, [isRecording]);

  useEffect(() => {
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
          if (isVoiceUsedRef.current) {
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
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    isVoiceUsedRef.current = false;
    setIsLoading(true);

    try {
      const result = await chatMentor({
        history: newMessages,
      });
      
      let responseText = result.response;
      
      responseText = generateHumanTone(responseText);

      setMessages([...newMessages, { role: "model", content: responseText }]);
      speakText(responseText);
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "AI Mentor is currently unavailable. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">AI Mentor Chat</h1>
        <p className="text-gray-400 mt-2">Your 24/7 personalized career guidance and support system.</p>
      </header>

      <div className="flex-1 flex flex-col min-h-0 liquid-glass-card rounded-3xl border border-white/10 overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between backdrop-blur-xl relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-black/60 flex items-center justify-center text-primary border border-primary/40 shadow-[0_0_20px_rgba(0,174,239,0.4)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
              <Bot className="h-6 w-6 relative z-10 drop-shadow-[0_0_8px_rgba(0,174,239,0.8)]" />
            </div>
            <div>
              <p className="text-base font-bold text-white tracking-wide">Placify Mentor</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex relative">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                </span> 
                Online & Ready
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-2">
              <span className="text-[10px] uppercase tracking-widest text-primary border border-primary/20 px-3 py-1 rounded-full bg-primary/10 hidden sm:inline-block shadow-[0_0_10px_rgba(0,174,239,0.1)]">Career Growth</span>
            </div>
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
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto as-scrollbar relative z-10" ref={scrollRef}>
          <div className="space-y-8 max-w-4xl mx-auto py-6">
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
                    <div className="relative z-10">{msg.content.replace(/\*\*/g, "")}</div>
                  </div>

                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-4 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-black/40 text-primary border border-primary/30 flex items-center justify-center mt-auto mb-1 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white/5 p-4 rounded-[20px] rounded-bl-sm border border-white/10 flex items-center gap-2 h-12">
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce shadow-[0_0_5px_rgba(59,130,246,0.8)] [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce shadow-[0_0_5px_rgba(59,130,246,0.8)] [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce shadow-[0_0_5px_rgba(59,130,246,0.8)]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md mb-2">
          <div className="max-w-4xl mx-auto relative z-10 w-full mb-2">
            <UiverseChatInput 
              placeholder={
                isRecording 
                  ? "Listening... Speak your question" 
                  : "Ask anything about your career..."
              }
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                isVoiceUsedRef.current = false;
              }}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              onSendAction={sendMessage}
              onMicToggle={toggleRecording}
              isRecording={isRecording}
              containerClassName="w-full"
            />
          </div>
          <div className="flex justify-center mt-3 gap-2 flex-wrap">
            <button onClick={() => setInput("How can I improve my resume?")} className="text-[10px] text-gray-400 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5 hover:text-white transition-all cursor-pointer">How can I improve my resume?</button>
            <button onClick={() => setInput("What are the best interview strategies?")} className="text-[10px] text-gray-400 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5 hover:text-white transition-all cursor-pointer">Best interview strategies?</button>
            <button onClick={() => setInput("Can you generate a learning roadmap?")} className="text-[10px] text-gray-400 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5 hover:text-white transition-all cursor-pointer">Learning roadmap?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
