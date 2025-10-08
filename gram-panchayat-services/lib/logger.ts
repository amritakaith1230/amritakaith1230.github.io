type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  action?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private log(entry: LogEntry) {
    if (this.isDevelopment) {
      console.log(
        `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.data || ""
      );
    }

    // In production, you might want to send logs to a service like LogRocket, Sentry, etc.
    if (!this.isDevelopment) {
      // Send to logging service
      this.sendToLoggingService(entry);
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // Example: Send to your logging service
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error("Failed to send log to service:", error);
    }
  }

  info(message: string, data?: any, userId?: string, action?: string) {
    this.log({ ...this.formatMessage("info", message, data), userId, action });
  }

  warn(message: string, data?: any, userId?: string, action?: string) {
    this.log({ ...this.formatMessage("warn", message, data), userId, action });
  }

  error(message: string, data?: any, userId?: string, action?: string) {
    this.log({ ...this.formatMessage("error", message, data), userId, action });
  }

  debug(message: string, data?: any, userId?: string, action?: string) {
    this.log({ ...this.formatMessage("debug", message, data), userId, action });
  }

  // Specific logging methods for common actions
  logUserAction(userId: string, action: string, details?: any) {
    this.info(`User action: ${action}`, details, userId, action);
  }

  logServiceAction(
    serviceId: string,
    action: string,
    userId?: string,
    details?: any
  ) {
    this.info(
      `Service action: ${action} for service ${serviceId}`,
      details,
      userId,
      action
    );
  }

  logApplicationAction(
    applicationId: string,
    action: string,
    userId?: string,
    details?: any
  ) {
    this.info(
      `Application action: ${action} for application ${applicationId}`,
      details,
      userId,
      action
    );
  }

  logAuthAction(action: string, userId?: string, details?: any) {
    this.info(`Auth action: ${action}`, details, userId, action);
  }
}

export const logger = new Logger();
