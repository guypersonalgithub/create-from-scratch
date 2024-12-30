#!/bin/sh
set -e
sh -c "git config --global user.name 'Automated' \
      && git config --global user.email 'automated@users.noreply.github.com' \
      && git add -A && git commit -m '$*' --allow-empty \
      && git push"