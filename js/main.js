var imgPath = "./img/user.jpg"; /// Global Variable for user Pic




///////////////////////////////////////////////////////////////////////////////////
/*********** function to create HTML for comment and post body *******************/
//////////////////////////////////////////////////////////////////////////////////
function commentAndPostLi(data) {
    return '<div class="postImg">' +
        '<img src="' + data.userPic + '">' +
        '</div>' +
        '<div class="postContent">' +
        '<div class="postUsername">' +
        '<h4>' + data.username + '</h4>' +
        '</div>' +
        '<div class="postPara">' +
        '<p>' + data.postText + '</p>' +
        '</div>' +
        '<div class="postTools">' +
        '<ul class="toolsUl">' +
        '<li><i class="icon-caret-down icon-3 cursor-pointer vote downvote"></i></li>' +
        '<li><i class="icon-caret-up icon-3 cursor-pointer vote upvote"></i></li>' +
        '<li class="voteCounter">0</li>' +
        '<li class="reply cursor-pointer" id="reply">Reply</li>' +
        '<li class="share cursor-pointer" id="share">Share</li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '<div class="clearfix"></div>' +

        '<div class="reply-container">' +
        '<div class="postedReplies">' +
        '<ul class="commentul"></ul>' +
        '</div>' +
        '<div class="replyForm"></div>' +
        '</div>' +
        '</div>' +
        '<div class="clearfix"></div>';
}



///////////////////////////////////////////////////////////////////////////////////
/*********** function to show the toastr on post a update *******************/
//////////////////////////////////////////////////////////////////////////////////
function showToastr() {
    var toastr = document.getElementsByClassName('toastr');
    toastr[0].style.display = 'block';

    setTimeout(function () {
        toastr[0].style.display = 'none';
    }, 1000)
}





///////////////////////////////////////////////////////////////////////////////////
/*********** function to create Post *******************/
//////////////////////////////////////////////////////////////////////////////////
function createPost(data, $_this) {
    if (data.username == "" || data.postText == "") {
        alert("Please Fill All the Fields")
    } else {
        var myLi = document.createElement("li");
        myLi.className = 'mainPostLi';
        myLi.innerHTML = commentAndPostLi(data);

        document.getElementById("mainPost").appendChild(myLi);

        var parentFormGroup = getParents($_this, '.formGroup');
        showToastr();
        clearFields(parentFormGroup[0].querySelector('.postText'), parentFormGroup[0].querySelector('.uname'));
    }
}





///////////////////////////////////////////////////////////////////////////////////
/*********** function to Clear the form Fields After Update or Comment Post *******************/
//////////////////////////////////////////////////////////////////////////////////
function clearFields(postTxtAr, postUname) {
    postTxtAr.value = "";
    postUname.value = "";
}






///////////////////////////////////////////////////////////////////////////////////
/*********** function to create Reply Form *******************/
//////////////////////////////////////////////////////////////////////////////////
function createReplyBody($_this) {

    var elem = document.createElement("div");
    elem.className = "mainReplyDiv";
    elem.innerHTML = '<div class="textarea"><textarea placeholder="Comment" class="postText" id="commentText"></textarea></div>' +
        '<div class="full">' +
        '<div class="col-9">' +
        '<div class="username">' +
        '<input placeholder="Username" class="uname" id="commentUName">' +
        '</div>' +
        '</div>' +
        '<div class="col-1">' +
        '<button type="button" class="comBtn cursor-pointer" id="commentBtn">Comment</button>' +
        '</div>' +
        '<div class="clearfix"></div>';
    var ifBodyExist = document.querySelector(".mainReplyDiv");

    // remove reply form if exist
    if (ifBodyExist) {
        ifBodyExist.remove();
    }

    var closestParent = getParents($_this, '.mainPostLi');
    closestParent[0].appendChild(elem)

}



///////////////////////////////////////////////////////////////////////////////////
/*********** function to find the Closest parent for targeted element *******************/
//////////////////////////////////////////////////////////////////////////////////
var getParents = function (elem, selector) {

    var parents = [];
    var firstChar;
    if (selector) {
        firstChar = selector.charAt(0);
    }
    // Get matches
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (selector) {

            // If selector is a class
            if (firstChar === '.') {

                if (elem.classList.contains(selector.substr(1))) {
                    parents.push(elem);
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    parents.push(elem);
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
                    parents.push(elem);
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                parents.push(elem);
            }

        } else {
            parents.push(elem);
        }

    }

    // Return parents if any exist
    if (parents.length === 0) {
        return null;
    } else {
        return parents;
    }

};







///////////////////////////////////////////////////////////////////////////////////
/*********** function to Post the Comment/Reply *******************/
//////////////////////////////////////////////////////////////////////////////////
function postComment(data, $_this) {
    var elem = $_this;
    if (data.postText == "" || data.uname == "") {
        alert("Fill all the Fields!!")
    } else {
        var parents = getParents(elem, '.mainPostLi');
        var replyBodyUl = document.createElement("li");
        replyBodyUl.id = "commentContainer";
        replyBodyUl.className = "mainPostLi";
        var commentUl = parents[0].querySelector(".commentul");
        replyBodyUl.innerHTML = commentAndPostLi(data)
        commentUl.appendChild(replyBodyUl);
        clearFields(parents[0].querySelector('.postText'), parents[0].querySelector('.uname'));
        removeCommentFormAfterPost($_this);
    }
}




///////////////////////////////////////////////////////////////////////////////////
/*********** remove comment body after successfully posted *******************/
//////////////////////////////////////////////////////////////////////////////////
function removeCommentFormAfterPost($_this) {
    var mainParent = getParents($_this, '.mainReplyDiv');
    var elemToRemove = mainParent[0];
    elemToRemove.remove();
}



///////////////////////////////////////////////////////////////////////////////////
/*********** function to Down or Up Vote based *******************/
//////////////////////////////////////////////////////////////////////////////////
function vote($_this) {
    var toolbarParent = getParents($_this, '.toolsUl');
    var upvoteCountContainer = toolbarParent[0].querySelector('.voteCounter');
    var getCurrentCount = parseInt(upvoteCountContainer.innerHTML);


    //Check if clicked button is upvote or down vote and increase and decrease it accordingly
    if ($_this.classList.contains('upvote')) {
        var newCount = getCurrentCount + 1;
    } else {
        var newCount = getCurrentCount - 1;
    }


    // Change the color of Counter on the basis of Count
    if (newCount < 0) {
        upvoteCountContainer.style.color = "red";
    } else if (newCount === 0) {
        upvoteCountContainer.style.color = "black";
    } else {
        upvoteCountContainer.style.color = "green";
    }

    upvoteCountContainer.innerHTML = newCount;
}






///////////////////////////////////////////////////////////////////////////////////
/////////*********** Click Handler for Creating New Post *****************////////
//////////////////////////////////////////////////////////////////////////////////
document.getElementById('postBtn').addEventListener('click', function (event) {
    var $_this = event.target;
    let myData = {};
    myData.postText = document.getElementById("postText").value;
    myData.username = document.getElementById("uname").value;
    myData.userPic = imgPath;
    createPost(myData, $_this);
});









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********** Click Handler for Dynamically created element and call the function according to clicked button *******************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector('body').addEventListener('click', function (event) {
    var $_this = event.target;
    // console.log($_this); 
    if ($_this.classList.contains('reply')) {
        createReplyBody($_this);
    } else if ($_this.classList.contains('comBtn')) {
        var parentForCommentData = getParents($_this, '.mainReplyDiv');
        var commentData = {};
        commentData.postText = parentForCommentData[0].querySelector('.postText').value;
        commentData.username = parentForCommentData[0].querySelector('.uname').value;
        commentData.userPic = imgPath;
        postComment(commentData, $_this);
    } else if ($_this.classList.contains('vote')) {
        vote($_this)
    }
});