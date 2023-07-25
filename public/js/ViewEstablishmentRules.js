const reviews = document.querySelectorAll(".review"); // List of all review text containers
const times = document.querySelectorAll(".review").length; // Total number of review text containers
const editBar = document.querySelectorAll("#EditMenu");
const reactionH = document.querySelectorAll("#helpful");
const reactionU = document.querySelectorAll("#unhelpful");
const reaction = document.querySelectorAll("#reaction");
const body = document.getElementsByTagName("BODY")[0];
const edbar = document.querySelectorAll("#EditNav");

const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".menu-bar");
const userPage = document.querySelector("#prof-page");
const userPic = document.querySelector("#prof-pic");
const searchBar = document.querySelector(".search-container");

const replyCont = document.querySelectorAll(".reply");
const replyContList = Array.from(replyCont);
console.log(replyContList);

/*
for (let i = 0; i < replyCont.length; i++) {
  rChild = replyContList[i].children[1];
  rChildChild = rChild.children[0];
  console.log(rChildChild);
  if (rChildChild.innerText == "") {
    rChild.style.display = "none";
  }
}
*/

const divSec = document.querySelector(".dividerSec");
const revRep = document.querySelector(".review-reply");

let arrH = [];
let arrU = [];
let currLike = [];
let currDLike = [];
let flag2 = true;

// GIVEN: Create a User constructor
const Review = function (reviewObj) {
  this.reviewObj = reviewObj;
  this.OrigText = JSON.parse(JSON.stringify(reviewObj.innerText));
  this.currentText = null;

  this.flag = false;
  this.toggle = false;
};

let reviewList = [];

checkTextTrunc();
checkReviewsCount();

menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
  searchBar.classList.toggle("active");
});
userPage.addEventListener("mouseover", function () {
  userPic.classList.toggle("hovered");
});
userPage.addEventListener("mouseout", function () {
  userPic.classList.toggle("hovered");
});

function reviewObjHelper(index) {
  reviewObject = reviewList[index].reviewObj;
  return reviewObject;
}

// more/less event listener
function checkTextTrunc() {
  for (let i = 0; i < times; i = i + 1) {
    revs = reviews[i];
    reviewList.push(new Review(revs));
    revObj = reviewObjHelper(i);

    // assign value of text shown here (change 80)
    revObj.innerText = truncateText(reviewList[i], 80, i, revObj);

    if (reviewList[i].OrigText.length > 80) {
      revObj.innerHTML += '<span id="more">&nbsp;See More</span>';
    }
  }
}

// Truncate excess texts
// https://stackoverflow.com/a/63162630
function truncateText(selector, maxLength, i, obj) {
  let element = selector;
  let toTruncate = element.OrigText;

  if (toTruncate.length > maxLength) {
    element.currentText = toTruncate.substr(0, maxLength) + "...";
    obj.innerText = element.currentText;

    element.flag = true;
    console.log(element, "Successfully Truncated");
  }
  return obj.innerText;
}

// toggle between see more and see less
//https://stackoverflow.com/a/62555388
for (let b = 0; b < times; b++) {
  reviews[b].addEventListener("click", function () {
    revObj = reviewObjHelper(b);
    if (reviewList[b].toggle == false && reviewList[b].flag == true) {
      revObj.innerHTML = reviewList[b].OrigText;
      revObj.innerHTML += '<span id="more">&nbsp;See Less</span>';
      reviewList[b].toggle = true;
    } else if (reviewList[b].toggle == true && reviewList[b].flag == true) {
      revObj.innerHTML = reviewList[b].currentText;
      revObj.innerHTML += '<span id="more">&nbsp;See More</span>';
      reviewList[b].toggle = false;
    }
  });
}

// more/less event listener end...
function textOrigHelper(i) {
  revs = reviews[i];
  org = revs.innerText;
  console.log("org before: ", org);
  orig = JSON.parse(JSON.stringify(org));

  return orig;
}

// editBar div event listener (when clicked delete/edit shows)
editBar.forEach((cell) =>
  cell.addEventListener("click", function () {
    console.dir(cell);
    if (flag2 == true) {
      console.log("3 Bars has been clicked...");
      cld = cell.lastElementChild;
      console.dir(cld);
      cld.style.display = "block";
      flag2 = false;
    } else if (flag2 == false) {
      console.log("3 Bars has been unclicked...");
      cld = cell.lastElementChild;
      cld.style.display = "none";
      flag2 = true;
    }

    if (flag2 == false) {
      console.log("UL now being read...");
      optionPath = cld.firstElementChild.children;
      replyButton = optionPath[0];
      editButton = optionPath[1];
      deleteButton = optionPath[2];

      editButton.addEventListener("click", function () {
        console.log("Reply clicked!");

        // Parent cell called
        cellParent = cell.parentElement;
        // Review left called.
        reviewLeft = cellParent.firstElementChild;
        //Review called
        reviewCont = reviewLeft.children[2];
        //Inner Text copied
        textValue = reviewCont.innerText;

        reviewListArr = Array.from(reviews);
        selectedRevIndex = reviewListArr.indexOf(reviewCont);

        // Replace Text with Edit Box
        revObj = reviewObjHelper(selectedRevIndex);
        revObj.innerHTML = "";

        revObj.nextElementSibling.style.display = "block";
        editBoxPath = revObj.nextElementSibling.children[0];
        editBoxPath[0].value = reviewList[selectedRevIndex].OrigText;

        console.dir(reviewCont);
      });

      replyButton.addEventListener("click", function () {
        console.log("Reply clicked!");

        cellParent = cell.parentElement;
        replyBox = cellParent.nextElementSibling;
        replyBox.style.display = "block";
      });

      deleteButton.addEventListener("click", function () {
        console.log("Delete clicked!");

        // Get the reviewDesc value from the hidden input field
        const reviewDesc = document.getElementById("reviewDesc").value;

        // Make the AJAX request to delete the review
        fetch("/deleteReview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewDesc }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            console.log("Review successfully deleted");
            cellParent = cell.parentElement;
            replyBox = cellParent.nextElementSibling;
            repliesBox = replyBox.nextElementSibling;
            cellParent.remove();
            repliesBox.remove();
            revRep.remove();
            checkReviewsCount();
          })
          .catch((error) => {
            console.error("Error deleting review:", error);
            // Handle any errors that occur during the deletion process
          });
      });
    }
  })
);

function checkReviewsCount() {
  if (divSec.children[0].children.length == 1) {
    divSec.innerHTML += '<h1 id="empty-alert">No Reviews Yet</h1>';
  }
}

// Function that adds "Edited" indicator when a user make changes to review
function ReviewEditConfirmedIndicator(reviewLeft) {
  reviewLeft.innerHTML += `<span id="editedIndc">Edited</span>`;
}

// click everywhere event listener
//https://stackoverflow.com/a/33657471
body.addEventListener(
  "click",
  function () {
    if (flag2 == false) {
      cld.style.display = "none";
      flag2 = true;
    }
  },
  false
);
// excludes editbar
editBar.forEach(
  (cell) =>
    cell.addEventListener("click", function (ev) {
      ev.stopPropagation(); //this is important! If removed, you'll get both alerts
    }),
  false
);
// excludes reaction div
reactionH.forEach(
  (cell) =>
    cell.addEventListener("click", function (ev) {
      ev.stopPropagation(); //this is important! If removed, you'll get both alerts
    }),
  false
);

// console.log(reaction[1]);

/*Initialize Reaction Button Data*/
// for (let i = 0; i < reactionH.length; i++) {
//   arrH.push(0);
//   arrU.push(0);
//   currLike.push(parseInt(reactionH[i].nextSibling.attributes[1].value));
//   currDLike.push(parseInt(reactionU[i].nextSibling.attributes[1].value));
// }

// for (let j = 0; j < reactionH.length; j++) {
//   reactionH[j].addEventListener("click", function () {
//     if (arrU[j] == 0 && arrH[j] == 0) {
//       reactionH[j].innerHTML =
//         '<i class="fa-solid fa-thumbs-up" style="color: #087d6f;"></i>';
//       currLike[j] += 1;
//       reactionH[j].nextSibling.innerText = currLike[j];
//       arrH[j] = 1;
//       console.log(arrH);
//     } else if (arrU[j] == 0 && arrH[j] == 1) {
//       reactionH[j].innerHTML =
//         '<i class="fa-solid fa-thumbs-up" style="color: #000000"></i>';
//       currLike[j] -= 1;
//       reactionH[j].nextSibling.innerText = currLike[j];
//       arrH[j] = 0;
//       console.log(arrH);
//     }
//   });
// }

// for (let k = 0; k < reactionU.length; k++) {
//   reactionU[k].addEventListener("click", function () {
//     if (arrH[k] == 0 && arrU[k] == 0) {
//       reactionU[k].innerHTML =
//         '<i class="fa-solid fa-thumbs-down" style="color: #087d6f;"></i>';
//       currDLike[k] += 1;
//       reactionU[k].nextSibling.innerText = currDLike[k];
//       arrU[k] = 1;
//       console.log(arrH);
//     } else if (arrH[k] == 0 && arrU[k] == 1) {
//       reactionU[k].innerHTML =
//         '<i class="fa-solid fa-thumbs-down" style="color: #000000"></i>';
//       currDLike[k] -= 1;
//       reactionU[k].nextSibling.innerText = currDLike[k];
//       arrU[k] = 0;
//       console.log(arrU);
//     }
//   });
// }

function sendFunc(event) {
  console.log(event);
  let checkbox = event.target;
  const dataId = checkbox.getAttribute("data-id");
  let image = checkbox.parentElement.querySelector(".icon img");
  const countSpan = checkbox.parentElement.querySelector(".count"); // Find the correct count span
  const countValue = parseInt(countSpan.getAttribute("value"));
  countL = countValue;

  let toggle = checkbox.checked;
  let toggled = 0;

  console.log("Data-id value:", dataId);
  console.log("Data toggle:", toggle);
  console.log("Data count:", countL);

  if (toggle) {
    toggled = 1;
    console.log("box is toggled");
    image.src = "assets/tbUP1.png";
    countL = countL + 1;
    countSpan.textContent = countL;
    jstring = JSON.stringify({ dataId, toggled, countL }); // Include the countValue in the JSON data
    console.log(jstring);
  } else {
    toggled = 0;
    image.src = "assets/tbUP0.png"; // Replace with the original image source for unchecked state
    console.log("box is not toggled");
    countSpan.textContent = countValue;
    jstring = JSON.stringify({ dataId, toggled, countValue }); // Include the countValue in the JSON data
    console.log(jstring);
  }

  // Use the fetch API to send the data to the server
  fetch("/reactionPost", {
    method: "POST",
    body: jstring,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    console.log(response);
  });
}

let reviewIds = [];

for (let j = 0; j < likeH.length; j++) {
  reviewIds.push(likeH[j].getAttribute("data-id"));
}

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the stored values from local storage and update the UI

  countingSpan.forEach((checkbox) => {
    console.log(checkbox);
    const dataId = checkbox.getAttribute("data-id");
    const dataToggle = parseInt(checkbox.getAttribute("data-toggle"));
    const dataCount = parseInt(checkbox.getAttribute("value"));
    const countSpan = checkbox.parentElement.querySelector(".count");
    let image = checkbox.parentElement.querySelector(".icon img");

    let toggle = checkbox.checked;
    let toggled = 0;

    console.log("Data-id value:", dataId);
    console.log("Data toggle:", dataToggle);
    console.log("Data count:", dataCount);

    if (dataToggle == 1) {
      image.src = "assets/tbUP1.png";
      console.log("box is toggled");
      countSpan.textContent = dataCount + 1;
    } else {
      image.src = "assets/tbUP0.png"; // Replace with the original image source for unchecked state
      console.log("box is not toggled");
      countSpan.textContent = dataCount;
    }
  });
});

if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}
