function collapse() {
    let expandableTrigger = document.getElementsByClassName("expandable");
    for (let i = 0; i < expandableTrigger.length; i++) {
        expandableTrigger[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let expandableSection = this.nextElementSibling;
            if (expandableSection.style.maxHeight) {
                expandableSection.style.maxHeight = null;
            } else {
                expandableSection.style.maxHeight = expandableSection.scrollHeight + "px";
            }
        });
    }
}