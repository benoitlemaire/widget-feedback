<template>
  <div>
    <div
      v-show="showOverlay"
      class="overlay fixed w-full h-screen top-0 left-0 cursor-crosshair z-9999"
      @mousemove="mouseMove"
      @mousedown="mouseDown"
      @mouseup="mouseUp"
    />

    <div
      v-show="showScreenArea"
      class="absolute border-2"
      :style="{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }"
    />

    <button
      class="bg-indigo-500 h-24 w-24 text-white text-center font-light rounded-full fixed bottom-4 right-4 focus:outline-none"
      @click="showOverlay = true"
    >
      Screenshot
    </button>

    <canvas
      v-show="showCanvas"
      id="screenWidgetOutputCanvas"
      class="fixed border-4 border-black top-0 right-0 object-cover"
    />
  </div>
</template>

<script>
import domtoimage from 'dom-to-image';

export default {
  data() {
    return {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      showOverlay: false,
      showScreenArea: false,
      showCanvas: false,
      isDragging: false,
    };
  },

  computed: {
    canvas() {
      return document.querySelector('#screenWidgetOutputCanvas');
    },

    ctx() {
      return this.canvas.getContext('2d');
    },
  },

  mounted() {
    this.setDraggableImgFalse();
  },

  methods: {
    mouseMove(e) {
      if (this.isDragging) {
        this.showScreenArea = true;

        this.x2 = e.clientX;
        this.y2 = e.pageY;

        this.reCalcPosition();
      }
    },

    mouseDown(e) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Reset canvas

      this.showCanvas = false;
      this.isDragging = true;

      this.x1 = e.clientX;
      this.y1 = e.pageY;

      this.reCalcPosition();
    },

    mouseUp() {
      this.isDragging = false;
      this.showScreenArea = false;
      this.takeScreenshot();
    },

    reCalcPosition() {
      const x3 = Math.min(this.x1, this.x2);
      const x4 = Math.max(this.x1, this.x2);
      const y3 = Math.min(this.y1, this.y2);
      const y4 = Math.max(this.y1, this.y2);

      this.left = x3;
      this.top = y3;
      this.width = x4 - x3;
      this.height = y4 - y3;
    },

    takeScreenshot() {
      domtoimage.toPng(document.body, { quality: 0.95 })
        .then((imageObject) => {
          const img = new Image();
          img.src = imageObject;

          this.canvas.width = this.width;
          this.canvas.height = this.height;

          img.onload = () => {
            // TODO : Remove after tests if canvas's ratio is ok
            const size = this.calculateAspectRatioFit(this.width, this.height, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(
              img, this.left, this.top, this.width, this.height,
              0, 0, size.width, size.height,
            );

            // TODO : Envoyer cette image au serveur uniquement quand on submit
            // const resultCanvas = new Image();
            // resultCanvas.src = this.canvas.toDataURL();

            // document.body.append(resultCanvas);

            this.showCanvas = true;
          };
        });
    },

    getHighestZindex() {
      const divs = document.querySelectorAll('div');
      let highestZIndex = 0;

      divs.forEach((div) => {
        // Get zIndex value from inline style or computed css
        const divZindex = parseInt(getComputedStyle(div, 'z-index').zIndex || div.style.zIndex, 10);

        if (!Number.isNaN(divZindex)) {
          if (divZindex > highestZIndex) {
            highestZIndex = divZindex + 1;
          }
        }
      });

      return highestZIndex;
    },

    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

      return {
        width: srcWidth * ratio,
        height: srcHeight * ratio,
      };
    },

    setDraggableImgFalse() {
      const imgs = document.querySelectorAll('img');

      imgs.forEach((img) => {
        img.setAttribute('draggable', false);
      });
    },
  },

};
</script>
