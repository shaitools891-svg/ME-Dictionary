interface PrayerTime {
  name: string;
  start: string;
  end: string;
  enabled: boolean;
}

interface PrayerScheduler {
  isActive: boolean;
  currentPrayer: string | null;
  prayers: PrayerTime[];
}

export class PrayerTimeScheduler {
  private scheduler: PrayerScheduler;
  private intervals: NodeJS.Timeout[] = [];
  private callbacks: Array<(isActive: boolean, prayer: string | null) => void> = [];

  constructor() {
    this.scheduler = {
      isActive: false,
      currentPrayer: null,
      prayers: [
        { name: 'Fajr', start: '05:00', end: '05:30', enabled: false },
        { name: 'Dhuhr', start: '12:30', end: '13:00', enabled: false },
        { name: 'Asr', start: '16:00', end: '16:30', enabled: false },
        { name: 'Maghrib', start: '18:45', end: '19:15', enabled: false },
        { name: 'Isha', start: '20:30', end: '21:00', enabled: false },
      ]
    };
  }

  updatePrayerSettings(prayers: PrayerTime[]) {
    this.scheduler.prayers = prayers;
    this.reschedule();
  }

  onStatusChange(callback: (isActive: boolean, prayer: string | null) => void) {
    this.callbacks.push(callback);
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      callback(this.scheduler.isActive, this.scheduler.currentPrayer);
    });
  }

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getCurrentTimeInMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  private checkPrayerTimes() {
    const currentMinutes = this.getCurrentTimeInMinutes();
    let isCurrentlyActive = false;
    let activePrayer = null;

    for (const prayer of this.scheduler.prayers) {
      if (!prayer.enabled) continue;

      const startMinutes = this.timeToMinutes(prayer.start);
      const endMinutes = this.timeToMinutes(prayer.end);

      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        isCurrentlyActive = true;
        activePrayer = prayer.name;
        break;
      }
    }

    const wasActive = this.scheduler.isActive;
    this.scheduler.isActive = isCurrentlyActive;
    this.scheduler.currentPrayer = activePrayer;

    if (wasActive !== isCurrentlyActive || this.scheduler.currentPrayer !== activePrayer) {
      this.notifyCallbacks();
    }
  }

  private reschedule() {
    // Clear existing intervals
    this.intervals.forEach(clearInterval);
    this.intervals = [];

    // Check every minute
    const interval = setInterval(() => {
      this.checkPrayerTimes();
    }, 60000); // Check every minute

    this.intervals.push(interval);

    // Check immediately
    this.checkPrayerTimes();
  }

  start() {
    this.reschedule();
  }

  stop() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    this.scheduler.isActive = false;
    this.scheduler.currentPrayer = null;
    this.notifyCallbacks();
  }

  getStatus() {
    return {
      isActive: this.scheduler.isActive,
      currentPrayer: this.scheduler.currentPrayer
    };
  }
}

export const prayerScheduler = new PrayerTimeScheduler();
