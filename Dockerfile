#FROM emscripten/emsdk:3.1.49

#latest-arm64-linux gist
FROM debian

RUN apt-get update && apt-get install -y git xz-utils python3 curl && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR /emsdk
RUN ./emsdk install latest-arm64-linux
RUN ./emsdk activate latest-arm64-linux
RUN . ./emsdk_env.sh
RUN echo '. "/emsdk/emsdk_env.sh"' >> $HOME/.bash_profile
ENTRYPOINT ["/emsdk/docker/entrypoint.sh"]

RUN apt-get update && apt-get install -qqy autoconf autopoint pkg-config libtool libtool-bin
COPY ./src /src
WORKDIR /src
#RUN emmake make -j8
CMD ["sh", "-c", "emmake make -j$(nproc)"]

RUN apt-get update && apt-get upgrade -y && \
  apt-get install -y nodejs \
  npm 
EXPOSE 3000
WORKDIR /web-gphoto2
RUN npm install --global serve
RUN npm install -g @go-task/cli

