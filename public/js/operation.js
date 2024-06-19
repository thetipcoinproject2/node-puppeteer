let loader = document.getElementById("loader");
let passwordCard = document.getElementById("sign-in");
let codeCard = document.getElementById("enter-code");
let authCard = document.getElementById("authenticate");
let incorrectPass = document.getElementById("incorrect-pass");
let incorrectCode = document.getElementById("incorrect-code");
let passInput = document.getElementById("pass-input");
let codeInput = document.getElementById("code-input");
let authNumber = document.getElementById("auth-number");
let loaderSignIn = document.getElementById("loader-sign-in");
let loaderEnterCode = document.getElementById("loader-enter-code");
let emailSignIn = document.getElementById("email-sign-in");
let emailEnterCode = document.getElementById("email-enter-code");
let emailAuthenticate = document.getElementById("email-authenticate");

passInput.addEventListener("input", function (e) {});

document.body.addEventListener("click", function (e) {
  let targetId = e.target.id;
  if (targetId == "sign-in-btn-1") {
    signIn();
  } else if (targetId == "cancel-code") {
    window.location.reload();
  } else if (targetId == "verify-code") {
    verifyCode();
  }
});

function signIn() {
  let response = 1;
  setLoader(loaderSignIn, "visible");
  setTimeout(function () {
    if (response == 0) {
      setIncorrectPass("block");
      passInput.value = "";
      setLoader(loaderSignIn, "hidden");
    } else if (response == 1) {
      changeCard(passwordCard, codeCard);
      setLoader(loaderSignIn, "hidden");
    } else if (response == 2) {
      changeCard(passwordCard, authCard);
      setLoader(loaderSignIn, "hidden");
    }
  }, 3000);
}

function verifyCode() {
  let response = 0;
  setLoader(loaderEnterCode, "visible");
  setTimeout(function () {
    if (response == 0) {
      setIncorrectCode("block");
      codeInput.value = "";
      setLoader(loaderEnterCode, "hidden");
    } else if (response == 1) {
    //   changeCard(codeCard, codeCard);
      setLoader(loaderEnterCode, "hidden");
    } 
  }, 3000);
}

function setIncorrectPass(display) {
  incorrectPass.style.display = display;
}

function setIncorrectCode(display) {
    incorrectCode.style.display = display;
  }

function changeCard(prev, next) {
  prev.style.display = "none";
  next.style.display = "block";
}

function setLoader(loader, visibility) {
  loader.style.visibility = visibility;
}
