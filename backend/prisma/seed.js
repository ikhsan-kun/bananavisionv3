const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const diseases = [
  {
    name: "Black Sigatoka",
    description:
      "Penyakit jamur yang disebabkan oleh Mycosphaerella fijiensis, menyebabkan garis-garis hitam pada daun pisang",
    category: "Jamur",
    severity: "Berat",
    symptoms: [
      "Garis-garis hitam longitudinal pada daun",
      "Daun menguning dan mati",
      "Pengurangan hasil panen",
      "Tanaman terlihat gundul",
    ],
    prevention: [
      "Gunakan varietas tahan",
      "Aplikasi fungisida preventif",
      "Perbaiki drainase lahan",
      "Jaga kebersihan kebun",
    ],
    treatment: ["Aplikasi fungisida segera", "Buang daun terinfeksi"],
    imageUrl: null,
    isActive: true,
  },
  {
    name: "Bract Mosaic Virus",
    description:
      "Penyakit virus yang menyerang bract dan daun pisang, menyebabkan pola mozaik",
    category: "Virus",
    severity: "Sedang",
    symptoms: [
      "Pola mozaik pada daun dan bract",
      "Daun keriput dan deformasi",
      "Pertumbuhan terhambat",
      "Buah tidak berkembang sempurna",
    ],
    prevention: [
      "Gunakan bibit bebas virus",
      "Kontrol populasi serangga vektor",
      "Sanitasi kebun",
      "Hindari tanam di lahan terinfeksi",
    ],
    treatment: ["Kontrol serangga vektor", "Buang tanaman terinfeksi"],
    imageUrl: null,
    isActive: true,
  },
  {
    name: "Healthy Leaf",
    description: "Daun pisang yang sehat tanpa adanya penyakit atau kerusakan",
    category: "Sehat",
    severity: "Ringan",
    symptoms: [
      "Tidak ada gejala penyakit",
      "Daun hijau segar",
      "Pertumbuhan normal",
    ],
    prevention: [
      "Pemeliharaan rutin",
      "Manajemen air yang baik",
      "Pemupukan seimbang",
    ],
    treatment: ["Tidak ada tindakan diperlukan", "Lanjutkan perawatan rutin"],
    imageUrl: null,
    isActive: true,
  },
  {
    name: "Insect Pest",
    description:
      "Kerusakan daun pisang akibat serangan hama seperti kutu, wereng, atau ulat",
    category: "Hama",
    severity: "Sedang",
    symptoms: [
      "Lubang-lubang pada daun",
      "Daun berwarna kuning atau coklat",
      "Kehadiran serangga pada daun",
      "Daun mengering dan rontok",
    ],
    prevention: [
      "Pantau populasi hama secara rutin",
      "Gunakan perangkap serangga",
      "Tanam tanaman pendamping",
      "Jaga kebersihan kebun",
    ],
    treatment: ["Aplikasi insektisida", "Pertimbangkan kontrol biologis"],
    imageUrl: null,
    isActive: true,
  },
  {
    name: "Moko Disease",
    description:
      "Penyakit bakteri yang menyebabkan layu bakteri pada tanaman pisang",
    category: "Bakteri",
    severity: "Berat",
    symptoms: [
      "Tanaman layu mendadak",
      "Daun menguning dari ujung",
      "Pseudostem berwarna kecoklatan di dalam",
      "Buah membusuk sebelum matang",
    ],
    prevention: [
      "Gunakan bibit sehat dari sumber terpercaya",
      "Sterilisasi alat pertanian",
      "Karantina tanaman baru",
      "Rotasi tanaman",
    ],
    treatment: ["Karantina", "Buang tanaman dan radius 2m sekitar"],
    imageUrl: null,
    isActive: true,
  },
  {
    name: "Panama Disease",
    description:
      "Penyakit jamur Fusarium yang menyebabkan layu vaskular pada pisang",
    category: "Jamur",
    severity: "Berat",
    symptoms: [
      "Daun tertua layu pertama",
      "Pelepah berwarna kuning keunguan",
      "Layu progresif dari bawah ke atas",
      "Akar membusuk",
    ],
    prevention: [
      "Gunakan varietas tahan Fusarium",
      "Sterilisasi tanah",
      "Jangan tanam di lahan bekas",
      "Sanitasi ketat",
    ],
    treatment: [
      "Tidak ada obat",
      "Gunakan varietas resisten",
      "Sanitasi ketat",
    ],
    imageUrl: null,
    isActive: true,
  },
  {
    name: "Yellow Sigatoka",
    description:
      "Penyakit jamur yang menyebabkan bintik-bintik kuning pada daun pisang",
    category: "Jamur",
    severity: "Sedang",
    symptoms: [
      "Bintik-bintik kuning pada daun",
      "Bintik membesar dan bergabung",
      "Daun mengering dan rontok",
      "Pengurangan fotosintesis",
    ],
    prevention: [
      "Aplikasi fungisida preventif",
      "Perbaiki drainase lahan",
      "Gunakan varietas tahan",
      "Pantau kelembaban udara",
    ],
    treatment: ["Fungisida preventif", "Perbaiki drainase tanah"],
    imageUrl: null,
    isActive: true,
  },
];

async function main() {
  console.log("Starting disease seeding...");

  try {
    // Delete existing diseases
    await prisma.disease.deleteMany({});
    console.log("leared existing diseases");

    // Create new diseases
    for (const disease of diseases) {
      await prisma.disease.create({
        data: disease,
      });
      console.log(`Created disease: ${disease.name}`);
    }

    console.log("Disease seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
