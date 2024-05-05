function toggleContent(contentId) {
    const content = document.getElementById(contentId);
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        content.style.display = 'block';
    }
}

function swapContent(contentId1, contentId2) {
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
    const errorDiv = document.getElementById("error");
    if(errorDiv){
        errorDiv.hidden = true;
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

function searchItems() {
    const shopId = document.getElementById('container').getAttribute('data-shop-id');
    const itemName = encodeURIComponent(document.getElementById('itemNameSearch').value);
    const itemDescription = encodeURIComponent(document.getElementById('itemDescriptionSearch').value);
    const excludeGluten = document.getElementById('glutenCheckbox').checked;
    const excludeDairy = document.getElementById('dairyCheckbox').checked;
    const excludePeanuts = document.getElementById('peanutsCheckbox').checked;
    const excludeTree = document.getElementById('treeCheckbox').checked;
    const excludeSesame = document.getElementById('sesameCheckbox').checked;
    const excludeMustard = document.getElementById('mustardCheckbox').checked;
    const excludeSoy = document.getElementById('soyCheckbox').checked;
    const excludeEggs = document.getElementById('eggsCheckbox').checked;
    const excludeFish = document.getElementById('fishCheckbox').checked;
    const excludeShellfish = document.getElementById('shellfishCheckbox').checked;
    let searchURL = '/shop/' + shopId + '/itemSearch/?name=' + itemName + '&description=' + itemDescription;
    if (excludeGluten) {
        searchURL += '&excludeGluten=true';
    }
    if (excludeDairy) {
        searchURL += '&excludeDairy=true';
    }
    if (excludePeanuts) {
        searchURL += '&excludePeanuts=true';
    }
    if (excludeTree) {
        searchURL += '&excludeTree=true';
    }
    if (excludeSesame) {
        searchURL += '&excludeSesame=true';
    }
    if (excludeMustard) {
        searchURL += '&excludeMustard=true';
    }
    if (excludeSoy) {
        searchURL += '&excludeSoy=true';
    }
    if (excludeEggs) {
        searchURL += '&excludeEggs=true';
    }
    if (excludeFish) {
        searchURL += '&excludeFish=true';
    }
    if (excludeShellfish) {
        searchURL += '&excludeShellfish=true';
    }
    window.location.href = searchURL;
}


function encodeSearchQuery(query) {
    return encodeURIComponent(query);
}