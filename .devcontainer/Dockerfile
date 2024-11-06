# Use an Ubuntu base image (or Debian, as Bun supports both)
FROM ubuntu:22.04

# Install Bun dependencies
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to the PATH
ENV PATH="/root/.bun/bin:$PATH"

# Optional: Set up a working directory
WORKDIR /workspaces/mina
