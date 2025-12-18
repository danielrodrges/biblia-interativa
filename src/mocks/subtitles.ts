// Mock de legendas sincronizadas (cues)
export interface SubtitleCue {
  start: number; // em segundos
  end: number;
  text: string; // texto no idioma de prática
}

// João 3 em inglês (versículos correspondentes)
export const mockSubtitles: SubtitleCue[] = [
  { start: 0, end: 5, text: "There was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council." },
  { start: 5, end: 12, text: "He came to Jesus at night and said, 'Rabbi, we know that you are a teacher who has come from God.'" },
  { start: 12, end: 18, text: "For no one could perform the signs you are doing if God were not with him." },
  { start: 18, end: 24, text: "Jesus replied, 'Very truly I tell you, no one can see the kingdom of God unless they are born again.'" },
  { start: 24, end: 30, text: "'How can someone be born when they are old?' Nicodemus asked." },
  { start: 30, end: 36, text: "'Surely they cannot enter a second time into their mother's womb to be born!'" },
  { start: 36, end: 43, text: "Jesus answered, 'Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.'" },
  { start: 43, end: 48, text: "Flesh gives birth to flesh, but the Spirit gives birth to spirit." },
  { start: 48, end: 53, text: "You should not be surprised at my saying, 'You must be born again.'" },
  { start: 53, end: 60, text: "The wind blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going." },
  { start: 60, end: 64, text: "So it is with everyone born of the Spirit." },
  { start: 64, end: 68, text: "'How can this be?' Nicodemus asked." },
  { start: 68, end: 73, text: "'You are Israel's teacher,' said Jesus, 'and do you not understand these things?'" },
  { start: 73, end: 80, text: "Very truly I tell you, we speak of what we know, and we testify to what we have seen, but still you people do not accept our testimony." },
  { start: 80, end: 86, text: "I have spoken to you of earthly things and you do not believe; how then will you believe if I speak of heavenly things?" },
  { start: 86, end: 92, text: "No one has ever gone into heaven except the one who came from heaven—the Son of Man." },
  { start: 92, end: 98, text: "Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up," },
  { start: 98, end: 103, text: "that everyone who believes may have eternal life in him." },
  { start: 103, end: 110, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
  { start: 110, end: 116, text: "For God did not send his Son into the world to condemn the world, but to save the world through him." },
  { start: 116, end: 124, text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son." }
];
