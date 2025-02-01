document.getElementById('save-note').addEventListener('click', function() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();

    if (noteText !== '') {
        // 获取现有的笔记
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        // 添加新笔记
        notes.push(noteText);
        localStorage.setItem('notes', JSON.stringify(notes));

        // 更新笔记列表
        updateNotesList();

        // 清空输入框
        noteInput.value = '';
    } else {
        alert('请输入笔记内容！');
    }
});

function updateNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // 清空现有列表

    // 获取笔记并显示
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        noteItem.textContent = note;
        notesList.appendChild(noteItem);
    });
}

// 页面加载时显示笔记
updateNotesList();
