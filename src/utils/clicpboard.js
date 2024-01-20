import Vue from 'vue';
import Clipboard from 'clipboard';

function clipboardSuccess() {
  Vue.prototype.$message({
    message: 'Copy Success',
    type: 'success',
    duration: 1500
  });
}

function clipboardError() {
  Vue.prototype.$message({
    message: 'Copy Failed',
    type: 'error'
  });
}

export default function copy(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  });
  clipboard.on('success', () => {
    clipboardSuccess();
    clipboard.destroy();
  });
  clipboard.on('error', () => {
    clipboardError();
    clipboard.destroy();
  });
  clipboard.onClick(event);
}