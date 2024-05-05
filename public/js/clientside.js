function toggleContent(contentId) {
    const content = document.getElementById(contentId);
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        content.style.display = 'block';
    }
}

function swapContent(contentId1,contentId2) {
    const content1 = document.getElementById(contentId1);
    const content2 = document.getElementById(contentId2);
    const button = document.getElementById('editButton');
    if (content1.style.display === 'block') {
        content1.style.display = 'none';
        content2.style.display = 'block';
    } else {
        content1.style.display = 'block';
        content2.style.display = 'none';
    }
    if(button.innerHTML == "Edit Info"){
        button.innerHTML = "View Info";
    } else {
        button.innerHTML = "Edit Info";
    }
}

function reviewSort(sorter){
    const highest = document.getElementById('highest');
    const lowest = document.getElementById('lowest');
    const newest = document.getElementById('newest');
    const oldest = document.getElementById('oldest');
    const atoz = document.getElementById('atoz');
    const ztoa = document.getElementById('ztoa');
    if(sorter === "highest"){
        highest.style.display = 'block';
        lowest.style.display = 'none';
        newest.style.display = 'none';
        oldest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "lowest"){
        highest.style.display = 'none';
        lowest.style.display = 'block';
        newest.style.display = 'none';
        oldest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "newest"){
        highest.style.display = 'none';
        lowest.style.display = 'none';
        newest.style.display = 'block';
        oldest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "oldest"){
        highest.style.display = 'none';
        lowest.style.display = 'none';
        newest.style.display = 'none';
        oldest.style.display = 'block';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "atoz"){
        highest.style.display = 'none';
        lowest.style.display = 'none';
        newest.style.display = 'none';
        oldest.style.display = 'none';
        atoz.style.display = 'block';
        ztoa.style.display = 'none';
    }
    if(sorter === "ztoa"){
        highest.style.display = 'none';
        lowest.style.display = 'none';
        newest.style.display = 'none';
        oldest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'block';
    }
}

function itemSort(sorter){
    const defaultT = document.getElementById('default');
    const cheapest = document.getElementById('cheapest');
    const expensive = document.getElementById('expensive');
    const highest = document.getElementById('highest');
    const lowest = document.getElementById('lowest');
    const atoz = document.getElementById('atoz');
    const ztoa = document.getElementById('ztoa');
    if(sorter === "cheapest"){
        defaultT.style.display = 'none';
        cheapest.style.display = 'block';
        expensive.style.display = 'none';
        highest.style.display = 'none';
        lowest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "expensive"){
        defaultT.style.display = 'none';
        cheapest.style.display = 'none';
        expensive.style.display = 'block';
        highest.style.display = 'none';
        lowest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "highest"){
        defaultT.style.display = 'none';
        cheapest.style.display = 'none';
        expensive.style.display = 'none';
        highest.style.display = 'block';
        lowest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "lowest"){
        defaultT.style.display = 'none';
        cheapest.style.display = 'none';
        expensive.style.display = 'none';
        highest.style.display = 'none';
        lowest.style.display = 'block';
        atoz.style.display = 'none';
        ztoa.style.display = 'none';
    }
    if(sorter === "atoz"){
        defaultT.style.display = 'none';
        cheapest.style.display = 'none';
        expensive.style.display = 'none';
        highest.style.display = 'none';
        lowest.style.display = 'none';
        atoz.style.display = 'block';
        ztoa.style.display = 'none';
    }
    if(sorter === "ztoa"){
        defaultT.style.display = 'none';
        cheapest.style.display = 'none';
        expensive.style.display = 'none';
        highest.style.display = 'none';
        lowest.style.display = 'none';
        atoz.style.display = 'none';
        ztoa.style.display = 'block';
    }
}


function encodeSearchQuery(query) {
    return encodeURIComponent(query);
}