// SoundManager.ts
import { Audio } from 'expo-av';

type TrackEndCallback = () => void;

interface PlaybackStatus {
  isLoaded: boolean;
  didJustFinish?: boolean;
  positionMillis?: number;
  durationMillis?: number;
}

class SoundManager {
  private sounds: { [key: string]: Audio.Sound } = {};
  public isMuted: boolean = false;
  private trackEndCallbacks: { [key: string]: TrackEndCallback[] } = {};

  async loadSound(key: string, soundFile: any): Promise<void> {
    if (this.sounds[key]) {
      await this.unloadSound(key);
    }
    console.log(`Loading Sound: ${key}`);
    const { sound } = await Audio.Sound.createAsync(soundFile, { isLooping: false });
    await sound.setIsLoopingAsync(false);  // Explicitly set looping to false
    sound.setOnPlaybackStatusUpdate((status) => this.handlePlaybackStatusUpdate(status as PlaybackStatus, key));
    this.sounds[key] = sound;
  }

  async playSound(key: string, loop: boolean = false, onPlaybackStatusUpdate?: (status: PlaybackStatus) => void): Promise<void> {
    if (!this.sounds[key]) {
      console.log(`Sound not loaded: ${key}`);
      return;
    }
    console.log(`Playing Sound: ${key}`);

    // Reset the sound before playing
    await this.resetSound(key);

    await this.sounds[key].setIsLoopingAsync(loop);

    const combinedCallback = (status: PlaybackStatus) => {
      this.handlePlaybackStatusUpdate(status, key);
      if (onPlaybackStatusUpdate) {
        onPlaybackStatusUpdate(status);
      }
      if (status.isLoaded && status.didJustFinish) {
        this.resetSound(key);
      }
    };

    this.sounds[key].setOnPlaybackStatusUpdate(combinedCallback);

    await this.sounds[key].playAsync();
  }

  private async resetSound(key: string): Promise<void> {
    if (this.sounds[key]) {
      await this.sounds[key].stopAsync();
      await this.sounds[key].setPositionAsync(0);
    }
  }
  async pauseSound(key: string): Promise<void> {
    if (!this.sounds[key]) {
      console.log(`Sound not loaded: ${key}`);
      return;
    }
    console.log(`Pausing Sound: ${key}`);
    await this.sounds[key].pauseAsync();
  }

  async stopSound(key: string): Promise<void> {
    if (!this.sounds[key]) {
      console.log(`Sound not loaded: ${key}`);
      return;
    }
    console.log(`Stopping Sound: ${key}`);
    await this.sounds[key].stopAsync();
  }

  async unloadSound(key: string): Promise<void> {
    if (!this.sounds[key]) {
      console.log(`No sound to unload: ${key}`);
      return;
    }
    console.log(`Unloading Sound: ${key}`);
    await this.sounds[key].unloadAsync();
    delete this.sounds[key];
  }

  async unloadAllSounds(): Promise<void> {
    for (const key in this.sounds) {
      await this.unloadSound(key);
    }
  }

  async muteSound(key: string): Promise<void> {
    if (!this.sounds[key]) {
      console.log(`Sound not loaded: ${key}`);
      return;
    }
    console.log(`Muting Sound: ${key}`);
    await this.sounds[key].setVolumeAsync(0);
    this.isMuted = true;
  }

  async unmuteSound(key: string): Promise<void> {
    if (!this.sounds[key]) {
      console.log(`Sound not loaded: ${key}`);
      return;
    }
    console.log(`Unmuting Sound: ${key}`);
    await this.sounds[key].setVolumeAsync(1);
    this.isMuted = false;
  }

  async setVolume(key: string, volume: number) {
    if (volume >= 0 && volume <= 1 && this.sounds[key] != undefined) {
      await this.sounds[key].setVolumeAsync(volume);
    } else {
      console.log('invalid volume setting');
    }
  }

  onTrackEnd(key: string, callback: TrackEndCallback): void {
    if (!this.trackEndCallbacks[key]) {
      this.trackEndCallbacks[key] = [];
    }
    this.trackEndCallbacks[key].push(callback);
  }

  offTrackEnd(key: string, callback: TrackEndCallback): void {
    if (this.trackEndCallbacks[key]) {
      this.trackEndCallbacks[key] = this.trackEndCallbacks[key].filter(cb => cb !== callback);
    }
  }

  private handlePlaybackStatusUpdate(status: PlaybackStatus, key: string): void {
    if (status.isLoaded && status.didJustFinish) {
      console.log(`Track ended: ${key}`);
      if (this.trackEndCallbacks[key]) {
        this.trackEndCallbacks[key].forEach(callback => callback());
      }
    }
  }
}

export default new SoundManager();