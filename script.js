// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateNotesList();
});

// 保存笔记
document.getElementById('save-note').addEventListener('click', function () {
    const noteInput = document.getElementById('note-input');
    const noteCategory = document.getElementById('note-category');
    const noteText = noteInput.value.trim();
    const category = noteCategory.value;

    if (noteText !== '') {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        const newNote = {
            id: Date.now(),
            content: noteText,
            category: category,
            createdAt: new Date().toLocaleString(),
            archived: false,
        };
        notes.push(newNote);
        localStorage.setItem('notes', JSON.stringify(notes));
        updateNotesList();
        noteInput.value = '';
    } else {
        alert('请输入笔记内容！');
    }
});

// 更新笔记列表
function updateNotesList(keyword = '') {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        if (note.content.toLowerCase().includes(keyword.toLowerCase())) {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            if (note.archived) noteItem.classList.add('archived');

            const noteCategory = document.createElement('div');
            noteCategory.classList.add('note-category');
            noteCategory.textContent = `分类：${note.category}`;

            const noteTime = document.createElement('div');
            noteTime.classList.add('note-time');
            noteTime.textContent = `创建时间：${note.createdAt}`;

            const noteContent = document.createElement('div');
            noteContent.classList.add('note-content');
            noteContent.innerHTML = marked.parse(note.content);

            const noteActions = document.createElement('div');
            noteActions.classList.add('note-actions');

            const archiveButton = document.createElement('button');
            archiveButton.textContent = note.archived ? '取消归档' : '归档';
            archiveButton.addEventListener('click', () => toggleArchive(note.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.addEventListener('click', () => deleteNote(note.id));

            noteActions.appendChild(archiveButton);
            noteActions.appendChild(deleteButton);

            noteItem.appendChild(noteCategory);
            noteItem.appendChild(noteTime);
            noteItem.appendChild(noteContent);
            noteItem.appendChild(noteActions);
            notesList.appendChild(noteItem);
        }
    });
}

// 删除笔记
function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    updateNotesList();
}

// 切换归档状态
function toggleArchive(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(note => note.id === noteId);
    if (note) {
        note.archived = !note.archived;
        localStorage.setItem('notes', JSON.stringify(notes));
        updateNotesList();
    }
}

// 搜索笔记
document.getElementById('search-input').addEventListener('input', function () {
    const keyword = this.value.trim();
    updateNotesList(keyword);
});

// 导出笔记
document.getElementById('export-notes').addEventListener('click', function () {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const content = notes.map(note => `[${note.category}] ${note.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// Markdown 实时预览
document.getElementById('note-input').addEventListener('input', function () {
    const previewArea = document.getElementById('note-preview');
    previewArea.innerHTML = marked.parse(this.value);
});
