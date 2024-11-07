# Use Ubuntu as the base image
ARG VARIANT="latest"
FROM ubuntu:${VARIANT}

# Arguments and environment variables
ARG USERNAME=root
ENV PATH="/root/.bun/bin:${PATH}"

# Update and install necessary packages
RUN apt-get update && \
    apt-get install -y curl unzip && \
    rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Make Bun accessible globally
RUN ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Optional: Add other tools or dependencies if needed
# RUN apt-get install -y <other-packages>
