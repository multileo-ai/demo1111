import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Chat with Maps Grounding ---

export const sendChatMessage = async (message: string, history: any[]) => {
  try {
    // Using gemini-2.5-flash for Maps Grounding as per instructions
    // OR gemini-3-pro-preview for general complex tasks. 
    // The prompt specifically asks to use `gemini-2.5-flash` (with googleMaps tool) for maps data.
    const modelName = 'gemini-2.5-flash';

    // Construct tool config
    const tools: any[] = [{ googleMaps: {} }];
    
    // If user location is available, we should ideally pass it in toolConfig.
    // For this demo, we'll use a fixed location or omit if not available immediately.
    const toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: 18.5204, // Pune coordinates as per prompt context
          longitude: 73.8567
        }
      }
    };

    const chatSession = ai.chats.create({
      model: modelName,
      config: {
        tools: tools,
        toolConfig: toolConfig,
        systemInstruction: "You are SAVRAKSH AI, a safety assistant for women. Keep answers concise, supportive, and safety-focused. Use the map tool to find safe places, police stations, and hospitals.",
      },
      history: history,
    });

    const result = await chatSession.sendMessage({ message });
    
    // Extract grounding chunks for URLs if they exist
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = result.text;

    return { text, groundingChunks };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "I'm having trouble connecting right now. Please try again.", groundingChunks: [] };
  }
};


// --- Live API (Native Audio) ---

export interface LiveSessionConfig {
  onOpen: () => void;
  onMessage: (text: string | null, audioBase64: string | null) => void;
  onError: (error: any) => void;
  onClose: () => void;
}

export const connectToLiveSession = async (config: LiveSessionConfig) => {
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  
  // We'll keep track of the session promise to send data
  let sessionPromise: Promise<any> | null = null;
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: "You are a calm, helpful safety assistant. Speak clearly and briefly.",
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
    callbacks: {
      onopen: () => {
        config.onOpen();
        
        // Set up audio processing pipeline
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          
          if (sessionPromise) {
            sessionPromise.then(session => {
               session.sendRealtimeInput({ media: pcmBlob });
            });
          }
        };
        
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: (message: LiveServerMessage) => {
        const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data || null;
        
        let transcript = null;
        if (message.serverContent?.outputTranscription) {
             transcript = message.serverContent.outputTranscription.text;
        }
        
        config.onMessage(transcript, audioBase64);
      },
      onerror: (e) => config.onError(e),
      onclose: (e) => config.onClose(),
    }
  });

  return {
    disconnect: () => {
      if (sessionPromise) {
        sessionPromise.then(session => session.close());
      }
      stream.getTracks().forEach(track => track.stop());
      inputAudioContext.close();
    }
  };
};

// Helper to create PCM Blob
function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  // Simple PCM encoding
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return {
    data: base64,
    mimeType: 'audio/pcm;rate=16000',
  };
}
