"use client";

import { useEffect, useRef, useCallback } from "react";

export const useArrivalSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedRef = useRef(false);

  const playArrivalSound = useCallback(async () => {
    if (hasPlayedRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (ctx.state !== 'running') {
        console.warn('AudioContext not running, state:', ctx.state);
        ctx.close();
        audioContextRef.current = null;
        return;
      }

      hasPlayedRef.current = true;
      const now = ctx.currentTime;
      const duration = 3.0;

      // Master compressor
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 25;
      compressor.ratio.value = 10;
      compressor.attack.value = 0.001;
      compressor.release.value = 0.2;
      compressor.connect(ctx.destination);

      // === CAPA 0: PICKUP INMEDIATO (Eco del warp) ===
      const pickup = ctx.createOscillator();
      pickup.type = 'sine';
      pickup.frequency.setValueAtTime(50, now);
      pickup.frequency.exponentialRampToValueAtTime(45, now + 0.3);

      const pickupGain = ctx.createGain();
      pickupGain.gain.setValueAtTime(1.6, now);
      pickupGain.gain.exponentialRampToValueAtTime(0.8, now + 0.15);
      pickupGain.gain.exponentialRampToValueAtTime(0.4, now + 0.4);

      pickup.connect(pickupGain);
      pickupGain.connect(compressor);
      pickup.start(now);
      pickup.stop(now + 0.5);

      // === PICKUP RUMBLE ===
      const pickupRumbleBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const pickupRumbleData = pickupRumbleBuffer.getChannelData(0);
      for (let i = 0; i < pickupRumbleData.length; i++) {
        pickupRumbleData[i] = Math.random() * 2 - 1;
      }
      const pickupRumble = ctx.createBufferSource();
      pickupRumble.buffer = pickupRumbleBuffer;

      const pickupRumbleFilter = ctx.createBiquadFilter();
      pickupRumbleFilter.type = 'lowpass';
      pickupRumbleFilter.frequency.setValueAtTime(120, now);
      pickupRumbleFilter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      const pickupRumbleGain = ctx.createGain();
      pickupRumbleGain.gain.setValueAtTime(1.2, now);
      pickupRumbleGain.gain.exponentialRampToValueAtTime(0.4, now + 0.4);

      pickupRumble.connect(pickupRumbleFilter);
      pickupRumbleFilter.connect(pickupRumbleGain);
      pickupRumbleGain.connect(compressor);
      pickupRumble.start(now);

      // === CAPA 1: SUB BASS DESCENDENTE ===
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(50, now);
      sub.frequency.exponentialRampToValueAtTime(18, now + duration);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(1.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      sub.connect(subGain);
      subGain.connect(compressor);
      sub.start(now);
      sub.stop(now + duration);

      // === CAPA 2: RUMBLE DESCENDENTE ===
      const rumbleBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const rumbleData = rumbleBuffer.getChannelData(0);
      for (let i = 0; i < rumbleData.length; i++) {
        rumbleData[i] = Math.random() * 2 - 1;
      }

      const rumble = ctx.createBufferSource();
      rumble.buffer = rumbleBuffer;

      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(120, now);
      rumbleFilter.frequency.exponentialRampToValueAtTime(35, now + duration);
      rumbleFilter.Q.value = 1.5;

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.setValueAtTime(1.1, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      rumble.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(compressor);
      rumble.start(now);

      // === CAPA 3: TONOS DESCENDENTES ===
      const createDescendingTone = (startFreq: number, startGain: number) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, now + duration);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 180;

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(startGain, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(compressor);
        osc.start(now);
        osc.stop(now + duration);
      };

      createDescendingTone(40, 0.6);
      createDescendingTone(38, 0.5);
      createDescendingTone(35, 0.4);
      createDescendingTone(32, 0.3);
      createDescendingTone(30, 0.24);

      // === CAPA 4: ENGINE APAGÁNDOSE ===
      const engine = ctx.createOscillator();
      engine.type = 'sawtooth';
      engine.frequency.setValueAtTime(60, now);
      engine.frequency.exponentialRampToValueAtTime(22, now + duration);

      const engineFilter = ctx.createBiquadFilter();
      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(150, now);
      engineFilter.frequency.exponentialRampToValueAtTime(50, now + duration);

      const engineGain = ctx.createGain();
      engineGain.gain.setValueAtTime(0.6, now);
      engineGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);

      engine.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(compressor);
      engine.start(now);
      engine.stop(now + duration);

      // === CAPA 5: GROWL DESCENDENTE ===
      const makeDistortionCurve = (amount: number) => {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
      };

      const growl = ctx.createOscillator();
      growl.type = 'sawtooth';
      growl.frequency.setValueAtTime(55, now);
      growl.frequency.exponentialRampToValueAtTime(25, now + duration);

      const growlFilter = ctx.createBiquadFilter();
      growlFilter.type = 'lowpass';
      growlFilter.frequency.setValueAtTime(150, now);
      growlFilter.frequency.exponentialRampToValueAtTime(60, now + duration);
      growlFilter.Q.value = 3;

      const distortion = ctx.createWaveShaper();
      distortion.curve = makeDistortionCurve(80);
      distortion.oversample = '4x';

      const growlGain = ctx.createGain();
      growlGain.gain.setValueAtTime(0.5, now);
      growlGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

      growl.connect(growlFilter);
      growlFilter.connect(distortion);
      distortion.connect(growlGain);
      growlGain.connect(compressor);
      growl.start(now);
      growl.stop(now + duration);

      // Cleanup
      setTimeout(() => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      }, (duration + 0.5) * 1000);

    } catch (e) {
      console.warn('Audio arrival sound failed:', e);
    }
  }, []);

  useEffect(() => {
    playArrivalSound();

    const handleInteraction = () => {
      if (!hasPlayedRef.current) {
        playArrivalSound();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [playArrivalSound]);
};
