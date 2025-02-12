const { nanoid } = require('nanoid');
const books = require('./books');

// menambahkan buku (POST /books)
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    // Jika readPage sama dengan pageCount, maka selesai membaca
    const finished = readPage === pageCount;
    const adjustedReading = finished ? false : reading;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading: adjustedReading, insertedAt, updatedAt };
    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: { bookId: id },
    }).code(201);
};

// mendapatkan semua buku (GET /books)
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((b) => b.reading == (reading === '1'));
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((b) => b.finished == (finished === '1'));
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
        },
    }).code(200);
};

// mendapatkan detail buku berdasarkan ID (GET /books/{bookId})
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: { book },
    }).code(200);
};

// mengupdate buku berdasarkan ID (PUT /books/{bookId})
const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const finished = readPage === pageCount;
    const adjustedReading = finished ? false : reading;

    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading: adjustedReading,
        updatedAt: new Date().toISOString(),
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

// menghapus buku berdasarkan ID (DELETE /books/{bookId})
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(bookIndex, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };