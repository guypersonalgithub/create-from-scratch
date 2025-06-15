import { SearchableCommands } from "../../../SearchableCommands";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";

export const Mount = () => {
  return (
    <div>
      <StyledMainTitle>Mount</StyledMainTitle>
      <div>The mount command is used in Linux to mount filesystems.</div>
      <SearchableCommands
        commands={[
          {
            command: "-t {type} {name} {target directory}",
            description:
              "type specifies the type of filesystem to mount. name is the device name. If the filesystem is a virtual filesystem that is not associated with a physical device, it would be none. target directory is where the filesystem will be mounted.",
          },
        ]}
      />
      <StyledSubTitle>Known filesystem names</StyledSubTitle>
      <div>
        <b>proc</b> is a virtual filesystem that exposes information about the running kernel,
        processes, and system configuration in real time. It doesn't exist on disk — it's created in
        memory by the kernel.
      </div>
      <div>When mounted:</div>
      <ul>
        <li>/proc/cpuinfo shows CPU information.</li>
        <li>/proc/meminfo shows memory usage.</li>
        <li>/proc/[PID]/ contains info about each process.</li>
      </ul>
      <div>
        In chroot environments (like during recovery, installation, or container setup), you might
        mount proc to allow tools in the new environment to access process/system info.
      </div>
      <div>
        <b>sysfs</b> is a virtual filesystem that exposes information about the kernel's view of
        hardware devices and their drivers. It was introduced as a cleaner replacement for parts of
        /proc.
      </div>
      <div>When mounted:</div>
      <ul>
        <li>/sys/class/ — info about device classes (e.g., net, block, power_supply).</li>
        <li>/sys/block/ — block devices like disks.</li>
        <li>/sys/devices/ — physical device tree.</li>
      </ul>
      <div>You'd mount sysfs manually in environments like:</div>
      <ul>
        <li>Initramfs/initrd scripts during early boot stages.</li>
        <li>
          Containers or chroot environments (e.g., system recovery or building an embedded Linux
          OS).
        </li>
        <li>When building a minimal or custom Linux system and needing access to device info.</li>
      </ul>
      <div>
        <b>tmpfs</b> is a RAM-based filesystem. Data stored here is temporary — it does not persist
        across reboots. It’s fast because it’s in memory.
      </div>
      <div>Typically used for:</div>
      <ul>
        <li>/tmp (temporary files)</li>
        <li>/run (runtime files)</li>
        <li>var/lock, var/tmp, etc., in some setups.</li>
      </ul>
      <div>Why mount /tmp as tmpfs?</div>
      <ul>
        <li>To increase speed for temporary file operations.</li>
        <li>To limit disk wear (especially on SSDs).</li>
        <li>To increase security (data is wiped on reboot).</li>
        <li>To contain temp files in memory, possibly with size limits.</li>
      </ul>
      <div>Its also possible to specify size with -o size=512M.</div>
      <div>
        If you already have /tmp on disk and mount tmpfs over it, its contents become hidden (until
        unmounted).
      </div>
      <div>
        Useful in containers, initramfs, minimal systems, or if your distro doesn’t already mount
        /tmp as tmpfs.
      </div>
    </div>
  );
};
