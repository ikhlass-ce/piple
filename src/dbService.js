import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'piple_media_catalog';

// Initial Mock Seed Data
const initialSeedData = [
  {
    id: "m-cyberpunk-2099",
    title: "Cyberpunk 2099: Neo-Neon",
    type: "movie",
    rating: 8.9,
    year: 2024,
    genres: ["Sci-Fi", "Action"],
    duration: "2h 15m",
    description: "In the sprawling mega-city of Neo-Neon, a cybernetically enhanced mercenary uncovers a corporate conspiracy that threatens to rewrite human consciousness. As lines blur between humanity and machine, they must navigate the neon-drenched underworld to save what remains of the digital frontier.",
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Kai Jensen (Mercenary)", "Dr. Evelyn Vance (Cyberneticist)", "Jaxon Frost (Fixer)"],
    trending: true,
    popular: true
  },
  {
    id: "m-interstellar-voyage",
    title: "Interstellar Voyage",
    type: "movie",
    rating: 9.2,
    year: 2022,
    genres: ["Sci-Fi", "Adventure"],
    duration: "2h 49m",
    description: "When humanity's last crop fields are ravaged by blight, a team of pioneering astronauts embarks on a desperate mission through a newly discovered wormhole. Seeking a habitable world across the stars, they face cosmic anomalies, temporal shifts, and the crushing weight of isolation.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Commander John Miller", "Dr. Amelia Brand", "TARS (AI Support)"],
    trending: true,
    popular: true
  },
  {
    id: "m-whispering-forest",
    title: "The Whispering Forest",
    type: "movie",
    rating: 7.8,
    year: 2023,
    genres: ["Horror", "Fantasy"],
    duration: "1h 48m",
    description: "A group of researchers enters an ancient forest that is omitted from modern maps. They soon discover that the trees hold memories of the past—and they do not tolerate intruders. Survival becomes a race against the setting sun and the shifting shadows of the woods.",
    poster: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    cast: ["Sarah Jenkins (Botanist)", "Liam O'Connor (Guide)", "Dr. Marcus Thorne (Historian)"],
    trending: false,
    popular: true
  },
  {
    id: "m-love-in-paris",
    title: "Love in Paris",
    type: "movie",
    rating: 7.2,
    year: 2025,
    genres: ["Romance", "Comedy"],
    duration: "1h 55m",
    description: "An introverted travel writer and a spontaneous street artist repeatedly cross paths in the romantic corridors of Paris. As they share their perspectives on life and art over a single week, they must decide if their connection is worth altering the course of their separate futures.",
    poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1499856138863-7a626d7ee7ad?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    cast: ["Chloe Dubois (Writer)", "Lucas Moreau (Artist)", "Sophie (Chloe's Friend)"],
    trending: false,
    popular: true
  },
  {
    id: "m-shadow-assassin",
    title: "Shadow Assassin",
    type: "movie",
    rating: 8.1,
    year: 2024,
    genres: ["Action"],
    duration: "2h 02m",
    description: "Betrayed by the very syndicate that raised him, a legendary assassin goes rogue. Armed with specialized cloaking technology and lethal martial arts expertise, he wages a one-man war against a criminal empire spanning Tokyo, London, and New York.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1600&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    cast: ["Kenji/Zero (Assassin)", "Reiko (Syndicate Leader)", "Agent Vance (Interpol)"],
    trending: true,
    popular: false
  },
  {
    id: "a-attack-on-titan",
    title: "Attack on Titan",
    type: "anime",
    rating: 9.1,
    year: 2013,
    genres: ["Action", "Fantasy"],
    episodes: "87 Episodes",
    description: "For a century, humanity lived inside massive walls, safe from the man-eating giants known as Titans. But when a colossal Titan breaches the outer wall, Eren Yeager witnesses his home destroyed and his mother devoured. Swearing absolute vengeance, Eren enlists in the Scout Regiment to reclaim the world outside.",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80",
    cast: ["Eren Yeager", "Mikasa Ackerman", "Armin Artlert", "Levi Ackerman"],
    trending: true,
    popular: true,
    epList: [
      { epNum: 1, title: "To You, in 2000 Years: The Fall of Shiganshina, Part 1", duration: "24m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { epNum: 2, title: "That Day: The Fall of Shiganshina, Part 2", duration: "23m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { epNum: 3, title: "A Dim Light Amid Despair: Humanity's Comeback, Part 1", duration: "24m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
    ]
  },
  {
    id: "a-naruto-shippuden",
    title: "Naruto Shippuden",
    type: "anime",
    rating: 8.7,
    year: 2007,
    genres: ["Action", "Adventure"],
    episodes: "500 Episodes",
    description: "After training with Jiraiya for two and a half years, Naruto Uzumaki returns to the Hidden Leaf Village. Stronger and more determined, he faces off against the rogue ninja organization Akatsuki, while continuing his desperate quest to rescue his friend Sasuke Uchiha from the dark paths of Orochimaru.",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80",
    cast: ["Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake"],
    trending: true,
    popular: true,
    epList: [
      { epNum: 1, title: "Homecoming", duration: "23m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
      { epNum: 2, title: "The Akatsuki Makes Its Move", duration: "24m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" }
    ]
  },
  {
    id: "a-frieren",
    title: "Frieren: Beyond Journey's End",
    type: "anime",
    rating: 9.3,
    year: 2023,
    genres: ["Fantasy", "Adventure"],
    episodes: "28 Episodes",
    description: "Elf mage Frieren and her courageous companions have defeated the Demon King, bringing peace to the land. As an elf with a lifespan of thousands of years, Frieren watches her human friends age and pass away. Regretting the short time she spent understanding them, she embarks on a new journey to learn more about humanity.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    cast: ["Frieren", "Fern", "Stark", "Himmel"],
    trending: true,
    popular: true,
    epList: [
      { epNum: 1, title: "The Journey's End", duration: "25m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" },
      { epNum: 2, title: "It Didn't Have to Be Magic", duration: "24m", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ]
  }
];

const getLocalCatalog = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSeedData));
    return initialSeedData;
  }
  return JSON.parse(data);
};

const saveLocalCatalog = (catalog) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(catalog));
};

export const dbService = {
  isSupabaseActive() {
    return supabase !== null;
  },

  async getCatalog() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('media_catalog')
          .select('*');
        if (error) throw error;
        return data.map(item => ({
          ...item,
          genres: typeof item.genres === 'string' ? JSON.parse(item.genres) : (item.genres || []),
          cast: typeof item.cast === 'string' ? JSON.parse(item.cast) : (item.cast || []),
          epList: typeof item.epList === 'string' ? JSON.parse(item.epList) : (item.epList || null)
        }));
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to LocalStorage:", err);
        return getLocalCatalog();
      }
    } else {
      return getLocalCatalog();
    }
  },

  async addItem(item) {
    const newItem = {
      ...item,
      id: item.id || `${item.type[0]}-${Date.now()}`
    };

    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('media_catalog')
          .insert([newItem])
          .select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn("Supabase insert failed, performing LocalStorage write:", err);
        return this.addLocalItem(newItem);
      }
    } else {
      return this.addLocalItem(newItem);
    }
  },

  addLocalItem(item) {
    const catalog = getLocalCatalog();
    catalog.push(item);
    saveLocalCatalog(catalog);
    return item;
  },

  async updateItem(id, updatedFields) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('media_catalog')
          .update(updatedFields)
          .eq('id', id)
          .select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn("Supabase update failed, performing LocalStorage write:", err);
        return this.updateLocalItem(id, updatedFields);
      }
    } else {
      return this.updateLocalItem(id, updatedFields);
    }
  },

  updateLocalItem(id, updatedFields) {
    let catalog = getLocalCatalog();
    catalog = catalog.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    saveLocalCatalog(catalog);
    return catalog.find(item => item.id === id);
  },

  async deleteItem(id) {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await supabase
          .from('media_catalog')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn("Supabase delete failed, performing LocalStorage write:", err);
        return this.deleteLocalItem(id);
      }
    } else {
      return this.deleteLocalItem(id);
    }
  },

  deleteLocalItem(id) {
    let catalog = getLocalCatalog();
    catalog = catalog.filter(item => item.id !== id);
    saveLocalCatalog(catalog);
    return true;
  }
};
