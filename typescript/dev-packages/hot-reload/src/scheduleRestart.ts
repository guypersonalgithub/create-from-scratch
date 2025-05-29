let reloadTimeout: NodeJS.Timeout | null = null;

type ScheduleRestartArgs = {
  startProcess: () => void;
};

export const scheduleRestart = ({ startProcess }: ScheduleRestartArgs) => {
  if (reloadTimeout) {
    clearTimeout(reloadTimeout);
  }

  reloadTimeout = setTimeout(() => {
    startProcess();
    reloadTimeout = null;
  }, 100);
};
