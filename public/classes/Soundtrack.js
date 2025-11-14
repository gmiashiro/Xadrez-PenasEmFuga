class Soundtrack {
    constructor() {
        this.soundtrack = [ // Lista de músicas de fundo
            {name: "sound1", src: "./assets/audio/songs/musicaFundo1.ogg"},
            {name: "sound2", src: "./assets/audio/songs/musicaFundo2.ogg"},
            {name: "sound3", src: "./assets/audio/songs/musicaFundo3.ogg"},
            {name: "sound4", src: "./assets/audio/songs/musicaFundo4.ogg"},
            {name: "sound5", src: "./assets/audio/songs/musicaFundo5.ogg"},
            {name: "sound6", src: "./assets/audio/songs/musicaFundo6.ogg"},
            
        ]
        this.currentSong = null; // Uma instancia da classe Howl (biblioteca howler) que abriga a música que está tocando no momento
        this.currentSongIndex = -1; // Variável que abriga o index do array soundtrack onde está a música atual (currentSong)
        this.isPlaying = false; // Para saber se está tocando uma música ou não

        document.addEventListener("desligarSong", () => {
            this.currentSong.stop();
            this.isPlaying = false;
        });

        document.addEventListener("ligarSong", () => {
            this.startSoundtrack();
        });

    }

    startSoundtrack() { // Começa a trilha sonora
        if (!this.isPlaying) { // Se nenhuma música está tocando
            this.startSoundtrackSong(); // Começa a tocar uma música
        }
    }

    startSoundtrackSong() { // Responsável por fazer uma música tocar
        this.currentSongIndex = this.getRandomSong(this.currentSongIndex); // sorteia o index da música a ser tocada
        this.currentSong = new Howl({ // Cria um Howl com o endereço de src no array soundtrack
            src: this.soundtrack[this.currentSongIndex].src,
        });
        this.currentSong.play(); // Toca a música
        this.isPlaying = true; // Atualiza a variável isPlaying
        

        this.currentSong.on('end', this.startSoundtrackSong.bind(this)); // Quando a música terminar, chama a função novamente
    }

    getRandomSong(currentSongIndex) { // Pega um index aleatório para escolher a música
        let newSongIndex; // Cria um novo index
        do {
            newSongIndex = Math.floor(Math.random() * this.soundtrack.length) + 0; // Sorteio que vai de 0 - o tamanho do array soundtrack
        } while (newSongIndex === currentSongIndex); // Só sai do loop se o novo index for diferente do antigo
        return newSongIndex; // Retorna o novo index
    }

}