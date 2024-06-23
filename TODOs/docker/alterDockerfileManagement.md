- Add a Dockerfile stage for each container with the command <mark>CMD ["sh", "-c", "while :; do sleep 2073600; done"]<mark> for the sake of debugging.
  This command will not run the actual project, and instead would just keep the container up in a loop, so that it would be easier to access the file system and the container's stats while its running.
- Add a Dockerfile stage for each container with accurate production stages.
- Alter the way Dockerfile handles local dependencies.
