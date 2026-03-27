FROM kong:latest
USER root
# Install build dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    unzip \
    build-essential \
    libssl-dev \
    gettext-base \
    && rm -rf /var/lib/apt/lists/*

# Install the plugin and its common dependencies
RUN git clone https://github.com/Platformatory/kong-plugin-jwt-keycloak.git \
    && cd kong-plugin-jwt-keycloak \
    && luarocks make


USER kong