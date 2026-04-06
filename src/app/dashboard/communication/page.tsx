"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { analyzeCommunicationSkills, AnalyzeCommunicationSkillsOutput } from "@/ai/flows/analyze-communication-skills";
import { Loader2, Mic2, Square, Play, RefreshCw, Volume2, Info, CircleDot, Radio, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UiverseLoader } from "@/components/ui/uiverse-loader";

export default function CommunicationPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeCommunicationSkillsOutput | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const totalAudioEnergyRef = useRef<number>(0);
  
  const { toast } = useToast();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  const startVisualizer = (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 64;
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        totalAudioEnergyRef.current += dataArray[i]; // Track total raw volume intensity
        // Neon cyan color for visualizer
        ctx.fillStyle = `rgba(34, 211, 238, ${Math.max(0.4, dataArray[i]/255)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(34, 211, 238, 0.8)";
        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      transcriptRef.current = "";
      totalAudioEnergyRef.current = 0;
      setRecordingSeconds(0);
      
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          
          recognitionRef.current.onresult = (event: any) => {
              let finalTranscript = '';
              for (let i = event.resultIndex; i < event.results.length; ++i) {
                  if (event.results[i].isFinal) {
                      finalTranscript += event.results[i][0].transcript + ' ';
                  }
              }
              if (finalTranscript) {
                  transcriptRef.current += finalTranscript;
              }
          };
          try { recognitionRef.current.start(); } catch(e) {}
      }

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
      };

      recorder.start();
      setIsRecording(true);
      setResults(null);
      startVisualizer(stream);
    } catch (err) {
      console.error(err);
      toast({
        title: "Microphone Access Denied",
        description: "Please enable microphone access in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      stopVisualizer();
      if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch(e) {}
      }
    }
  };

  const detectSpeechOrMusic = async (audioBlob: Blob) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const data = audioBuffer.getChannelData(0);

      let zeroCrossings = 0;
      let energy = 0;

      for (let i = 1; i < data.length; i++) {
        if ((data[i - 1] > 0 && data[i] < 0) || (data[i - 1] < 0 && data[i] > 0)) {
          zeroCrossings++;
        }
        energy += Math.abs(data[i]);
      }

      const zcr = zeroCrossings / data.length;
      const avgEnergy = energy / data.length;

      // Heuristic:
      // speech = irregular waveform
      // music = smoother + repetitive
      if (zcr < 0.08 && avgEnergy > 0.02) {
        return "music";
      }

      return "speech";
    } catch(e) {
      console.warn("ZCR fallback failed", e);
      return "speech"; // fail open
    }
  };

  const handleAnalyze = async () => {
    if (!audioBase64 || isLoading) return;
    
    if (results) {
        toast({
            title: "Already Analyzed",
            description: "Showing previously generated results for this recording.",
        });
        return;
    }

    setIsLoading(true);
    
    // Evaluate the blob with ZCR/Energy advanced detector
    const audioBlob = new Blob(chunksRef.current, { type: mediaRecorderRef.current?.mimeType || "audio/webm" });
    const type = await detectSpeechOrMusic(audioBlob);
    
    if (type === "music") {
        setResults({
            communicationScore: 12,
            fluencyFeedback: "Insufficient verified speech detected. The rhythm and vocal structures heavily mimic musical elements or loud background noise.",
            confidenceFeedback: "Unable to assess professional conversational confidence due to dominant melodic/noise vocal patterns.",
            clarityFeedback: "Very poor clarity. High audio volumes were measured, but extremely few recognizable words were parsed.",
            overallFeedback: "Warning: High volume of non-speech elements (Singing, Music, or Heavy Noise) was prominently detected. Please record a standard professional spoken elevator pitch without melody or background soundtracks."
        });
        toast({
            title: "Analysis Diverted",
            description: "System heuristically rejected the input as musical/noise.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      const output = await analyzeCommunicationSkills({ 
         audioDataUri: audioBase64,
         transcript: transcriptRef.current
      });
      
      if (output && 'error' in output) {
         toast({
            title: "Analysis Error",
            description: output.error,
            variant: "destructive",
         });
         return;
      }

      setResults(output as AnalyzeCommunicationSkillsOutput);
      localStorage.setItem('placify_comm_analysis', JSON.stringify(output));
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Analysis Error",
        description: error.message || "Could not process your recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Communication Analyzer</h1>
        <p className="text-gray-400 mt-2">Practice your elevator pitch and get AI feedback on fluency, confidence, and clarity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel: Recording Interface */}
        <div className="glass-card rounded-2xl border border-white/5 h-fit p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold text-white">Voice Recording</h2>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse font-mono font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <CircleDot className="h-3 w-3" />
                {formatTime(recordingSeconds)}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400 -mt-6">Record 30-60 seconds of yourself introducing your professional background.</p>
          
          <div className="flex flex-col items-center py-6 space-y-8 w-full">
            <div className={`relative flex items-center justify-center h-56 w-full max-w-sm rounded-[2rem] border transition-all duration-700 overflow-hidden shadow-inner ${isRecording ? 'border-red-500/50 bg-red-950/20 shadow-[inset_0_0_50px_rgba(239,68,68,0.1)]' : 'border-cyan-500/30 bg-cyan-950/20'}`}>
              
              {/* Concentric glowing rings if recording */}
              {isRecording && (
                <>
                  <div className="absolute inset-0 border border-red-500/20 rounded-[2rem] animate-ping opacity-20"></div>
                  <div className="absolute w-40 h-40 border border-red-500/30 rounded-full animate-ping opacity-30" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute w-24 h-24 border border-red-500/40 rounded-full animate-ping opacity-40" style={{ animationDuration: '1.5s' }}></div>
                </>
              )}

              {isRecording ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                  <canvas ref={canvasRef} width={300} height={100} className="w-full h-24 mb-4" />
                  <Radio className="h-8 w-8 text-cyan-400 animate-spin-slow opacity-80" />
                  <div className="mt-2 text-[10px] tracking-[0.2em] font-bold text-cyan-400">ANALYZING WAVEFORM...</div>
                </div>
              ) : (
                <div className="flex flex-col items-center z-10 transition-transform group-hover:scale-110 duration-300">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 neon-glow relative">
                    <Mic2 className="h-8 w-8 text-cyan-400" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Ready to start recording</p>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">REC</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 w-full justify-center">
              {!isRecording ? (
                <Button onClick={startRecording} className="w-48 rounded-full h-14 text-base font-bold bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform hover:scale-105">
                  <Mic2 className="mr-2 h-5 w-5" /> Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} className="w-48 rounded-full h-14 text-base font-bold bg-red-500 text-white hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform hover:scale-105">
                  <Square className="mr-2 h-5 w-5" /> Stop Recording
                </Button>
              )}
            </div>

            {audioUrl && !isRecording && (
              <div className="w-full space-y-4 pt-6 border-t border-white/5 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <Volume2 className="h-5 w-5 text-gray-400" />
                  <audio src={audioUrl} controls className="flex-1 opacity-90 invert-[0.8] grayscale contrast-200 h-8" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleAnalyze} className="flex-1 h-12 bg-primary text-black hover:bg-blue-400 font-bold neon-glow transition-all" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : results ? (
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                    ) : (
                      <Play className="mr-2 h-5 w-5" />
                    )}
                    {results ? "Analysis Complete" : "Analyze My Voice"}
                  </Button>
                  <Button variant="outline" className="h-12 w-12 p-0 rounded-xl glass border-white/20 text-gray-400 hover:text-white" onClick={() => {setAudioUrl(null); setAudioBase64(null); setResults(null); setRecordingSeconds(0);}} disabled={isLoading}>
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Feedback Results */}
        <div className="space-y-6">
          {!results && !isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-dashed border-white/10">
              <Info className="h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-headline font-semibold text-white">Awaiting Audio</h3>
              <p className="text-sm text-gray-400 max-w-xs mt-2 leading-relaxed">
                Once you finish your recording and click 'Analyze', your professional communication metrics will appear here.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex items-center justify-center glass-card rounded-2xl border border-white/5">
               <UiverseLoader text="PROCESSING" />
            </div>
          )}

          {results && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              {/* Overall Score Card */}
              <div className="glass-card rounded-2xl border-t-4 border-t-cyan-500 overflow-hidden hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-white">Communication Score</span>
                    <span className="text-4xl font-headline font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">{results.communicationScore}%</span>
                  </div>
                  <Progress value={results.communicationScore} className="h-3 mb-6 bg-black/20 ring-1 ring-white/10 [&>div]:bg-cyan-500" />
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-inner">
                    <p className="text-sm text-gray-300 font-bold mb-2 flex items-center gap-2">
                       Overall Feedback
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {results.overallFeedback}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-3">Fluency</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{results.fluencyFeedback}</p>
                </div>
                
                <div className="glass-card rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">Confidence</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{results.confidenceFeedback}</p>
                </div>
                
                <div className="glass-card rounded-xl p-5 border border-emerald-500/20 hover:border-emerald-500/50 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">Clarity</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{results.clarityFeedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
