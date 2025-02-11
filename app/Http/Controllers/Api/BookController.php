<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller {
    public function index () {
        $books = Book::with('author')->get();
        $books->each(function ($book) {
            $book->cover_url = $book->cover ? Storage::url("covers/$book->cover") : null;
        });

        return response()->json($books);
    }

    public function store (Request $request) {
        $request->validate(
            [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'publishDate' => 'required|date',
                'author' => 'required|exists:authors,id',
                'cover' => 'nullable|image|mimes:jpg,png|max:2048',
            ],
            [
                'cover.image' => 'O arquivo enviado deve ser uma imagem.',
                'cover.mimes' => 'A imagem deve estar no formato JPG ou PNG.',
                'cover.max' => 'A imagem não pode ter mais de 2MB.',
            ]
        );

        try {
            $book = new Book();
            $book->title = $request->title;
            $book->description = $request->description;
            $book->publishDate = $request->publishDate;
            $book->author = $request->author;

            if ($request->hasFile('cover')) {
                $book->cover = $this->processCoverImage($request->file('cover'));
            }

            $book->save();
            $book->load('author');
            $book->cover = $book->cover ? Storage::url("covers/$book->cover") : null;

            return response()->json($book, 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * @throws Exception
     * @noinspection DuplicatedCode
     */
    private function processCoverImage ($image): string {
        $filename = uniqid() . '.' . $image->getClientOriginalExtension();
        $path = storage_path("app/public/covers/$filename");

        $img = null;
        if ($image->getClientOriginalExtension() === 'jpg') {
            $img = imagecreatefromjpeg($image->getRealPath());
        } elseif ($image->getClientOriginalExtension() === 'png') {
            $img = imagecreatefrompng($image->getRealPath());
        }

        if (!$img) {
            throw new Exception('Formato de imagem não suportado.');
        }

        $resizedImg = imagescale($img, 200, 200);

        if ($image->getClientOriginalExtension() === 'jpg') {
            imagejpeg($resizedImg, $path);
        } elseif ($image->getClientOriginalExtension() === 'png') {
            imagepng($resizedImg, $path);
        }

        imagedestroy($img);
        imagedestroy($resizedImg);

        return $filename;
    }

    public function show ($id) {
        $book = Book::with('author')->findOrFail($id);
        $book->cover_url = $book->cover ? Storage::url("covers/$book->cover") : null;

        return response()->json($book);
    }

    public function update (Request $request, $id) {
        $request->validate(
            [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'publishDate' => 'required|date',
                'author' => 'required|exists:authors,id',
                'cover' => 'nullable|image|mimes:jpg,png|max:2048',
            ],
            [
                'cover.image' => 'O arquivo enviado deve ser uma imagem.',
                'cover.mimes' => 'A imagem deve estar no formato JPG ou PNG.',
                'cover.max' => 'A imagem não pode ter mais de 2MB.',
            ]
        );

        try {
            $book = Book::findOrFail($id);
            $book->title = $request->title;
            $book->description = $request->description;
            $book->publishDate = $request->publishDate;
            $book->author = $request->author;

            if ($request->hasFile('cover')) {
                if ($book->cover) {
                    Storage::delete("public/covers/$book->cover");
                }
                $book->cover = $this->processCoverImage($request->file('cover'));
            }

            $book->save();
            $book->load('author');
            $book->cover_url = $book->cover ? Storage::url("covers/$book->cover") : null;

            return response()->json($book);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy ($id) {
        $book = Book::findOrFail($id);

        if ($book->cover) {
            Storage::delete("public/covers/$book->cover");
        }

        $book->delete();
        return response()->json(null, 204);
    }
}
