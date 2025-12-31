document.addEventListener("DOMContentLoaded", function () {
  var jbackFrame;
  var jbackBtnOpen;
  var jbackScript = document.querySelector("script[jback-id]");
  var jbackId = jbackScript.getAttribute("jback-id") || "";
  var url = jbackScript.src.split("/widgets.js")[0] || "";
  var appUrl = url;

  function Jback() {
    var self = this;

    fetch(`${appUrl}/api/team/${jbackId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.success) {
          var dataTeam = res?.data;
          var css = document.createElement("link");
          css.href = `${url}/widgets.css`;
          css.type = "text/css";
          css.rel = "stylesheet";
          css.media = "screen";

          document.getElementsByTagName("head")[0].appendChild(css);
          document.body.insertAdjacentHTML(
            "beforeend",
            `<a id="jback-btn-open" class="jback-toggle-feedback jback-btn-open-${dataTeam?.style?.button_position}" href="javascript:;" style="background: ${dataTeam?.style?.button_bg};color: ${dataTeam?.style?.button_color}">
            ${dataTeam?.style?.button_text}
          </a>

          <div id="jback-frame" class="jback-frame-closed" style="display:none;">
              <iframe allowfullscreen="true" class="jback-frame-embed" title="Jback" role="dialog" src="${appUrl}/collect/${jbackId}"></iframe>
          </div>`
          );

          document.addEventListener("click", function (event) {
            var target = event.target;
            function prevent() {
              event.preventDefault();
              event.stopPropagation();
            }
            if (target.matches(".jback-toggle-feedback")) {
              self.toggle();
              prevent();
            } else if (target.matches(".jback-open-feedback")) {
              self.open();
              prevent();
            } else if (target.matches(".jback-close-feedback")) {
              self.close();
              prevent();
            }
          });

          jbackFrame = document.getElementById("jback-frame");
          jbackBtnOpen = document.getElementById("jback-btn-open");
        }
      });

    return self;
  }

  Jback.prototype.toggle = function () {
    var self = this;
    jbackFrame.style.display = "block";

    var isOpen = jbackFrame.classList.contains("jback-frame-open");
    if (isOpen) {
      jbackFrame.classList.remove("jback-frame-open");
      jbackFrame.classList.add("jback-frame-closed");
      jbackBtnOpen.style.display = "inline";
    } else {
      jbackFrame.classList.remove("jback-frame-closed");
      jbackFrame.classList.add("jback-frame-open");
      jbackFrame.classList.add("slide-in-bck-br");
      jbackBtnOpen.style.display = "none";
    }

    return self;
  };

  window.jback = new Jback();
  window.addEventListener("message", (event) => {
    if (event.data == "jback-minimized") {
      window.jback.toggle();
    }
    return;
  });
});
