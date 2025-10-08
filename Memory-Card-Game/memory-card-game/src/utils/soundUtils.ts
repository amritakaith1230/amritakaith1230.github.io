// Sound utility functions for the memory card game

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private isEnabled = true

  constructor() {
    this.initializeSounds()
  }

  private initializeSounds() {
    // Create audio contexts for different sounds
    this.sounds.success = this.createSound([
      { frequency: 523.25, duration: 0.2 }, // C5
      { frequency: 659.25, duration: 0.2 }, // E5
      { frequency: 783.99, duration: 0.3 }, // G5
    ])

    this.sounds.wrong = this.createSound([
      { frequency: 220, duration: 0.3 }, // A3
      { frequency: 196, duration: 0.4 }, // G3
    ])

    this.sounds.congratulations = this.createSound([
      { frequency: 523.25, duration: 0.2 }, // C5
      { frequency: 659.25, duration: 0.2 }, // E5
      { frequency: 783.99, duration: 0.2 }, // G5
      { frequency: 1046.5, duration: 0.4 }, // C6
    ])
  }

  private createSound(notes: { frequency: number; duration: number }[]): HTMLAudioElement {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const duration = notes.reduce((sum, note) => sum + note.duration, 0)

    // Create a buffer
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    let currentTime = 0
    notes.forEach((note) => {
      const startSample = Math.floor(currentTime * audioContext.sampleRate)
      const endSample = Math.floor((currentTime + note.duration) * audioContext.sampleRate)

      for (let i = startSample; i < endSample; i++) {
        const t = (i - startSample) / audioContext.sampleRate
        const envelope = Math.exp(-t * 3) // Exponential decay
        data[i] = Math.sin(2 * Math.PI * note.frequency * t) * envelope * 0.3
      }

      currentTime += note.duration
    })

    // Convert buffer to audio element
    const audio = new Audio()
    const blob = this.bufferToWave(buffer, audioContext.sampleRate)
    audio.src = URL.createObjectURL(blob)
    audio.volume = 0.5

    return audio
  }

  private bufferToWave(buffer: AudioBuffer, sampleRate: number): Blob {
    const length = buffer.length
    const arrayBuffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(arrayBuffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + length * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, length * 2, true)

    // Convert float samples to 16-bit PCM
    const data = buffer.getChannelData(0)
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]))
      view.setInt16(offset, sample * 0x7fff, true)
      offset += 2
    }

    return new Blob([arrayBuffer], { type: "audio/wav" })
  }

  play(soundName: string) {
    if (!this.isEnabled || !this.sounds[soundName]) return

    try {
      const sound = this.sounds[soundName].cloneNode() as HTMLAudioElement
      sound.currentTime = 0
      sound.play().catch((error) => {
        console.warn("Could not play sound:", error)
      })
    } catch (error) {
      console.warn("Sound playback failed:", error)
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  setVolume(volume: number) {
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = Math.max(0, Math.min(1, volume))
    })
  }
}

// Create a singleton instance
const soundManager = new SoundManager()

// Export the play function
export const playSound = (soundName: "success" | "wrong" | "congratulations") => {
  soundManager.play(soundName)
}

export const toggleSound = () => {
  return soundManager.toggle()
}

export const setSoundVolume = (volume: number) => {
  soundManager.setVolume(volume)
}
