-- CreateEnum
CREATE TYPE "LyricsSource" AS ENUM ('lrclib', 'ai');

-- CreateEnum
CREATE TYPE "McerLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateTable
CREATE TABLE "excluded_video" (
    "id" SERIAL NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "excluded_video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song" (
    "id" SERIAL NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" "McerLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lyric" (
    "id" SERIAL NOT NULL,
    "song_id" INTEGER NOT NULL,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB NOT NULL,
    "source" "LyricsSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lyric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" TEXT NOT NULL,
    "song_id" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" "McerLevel" NOT NULL,
    "pronunciation" TEXT NOT NULL,
    "context_sentence" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grammar_point" (
    "id" TEXT NOT NULL,
    "song_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "level" "McerLevel" NOT NULL,
    "context_sentence" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "examples" JSONB NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" TEXT NOT NULL,
    "songId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "excluded_video_youtube_id_key" ON "excluded_video"("youtube_id");

-- CreateIndex
CREATE UNIQUE INDEX "song_youtube_id_key" ON "song"("youtube_id");

-- CreateIndex
CREATE UNIQUE INDEX "lyric_song_id_key" ON "lyric"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_song_id_word_key" ON "vocabulary"("song_id", "word");

-- AddForeignKey
ALTER TABLE "lyric" ADD CONSTRAINT "lyric_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grammar_point" ADD CONSTRAINT "grammar_point_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_songId_fkey" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
