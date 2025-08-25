FROM oven/bun:alpine

# Config Bun
ENV PATH="~/.bun/bin:${PATH}"
RUN ln -s /usr/local/bin/bun /usr/local/bin/node

# Update packages
RUN if [ "alpine" == "alpine" ] ; then apk update ; else apt-get update ; fi

# Install Git
RUN if [ "alpine" == "alpine" ] ; then apk add git ; else apt-get install -y git ; fi

RUN mkdir -p /etc/profile.d && printf '#!/bin/sh\nexport PS1="\\e[1;32m\\w \\e[0m\\e[1;34m\\$ \\e[0m"\n' > /etc/profile.d/custom.sh && chmod +x /etc/profile.d/custom.sh
ENV ENV=/etc/profile.d/custom.sh