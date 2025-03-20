// shortcut.js
export class Shortcut {
    constructor() {
      this.Ctrl = false;
      this.Shift = false;
      this.Alt = false;
      this.Key = '';
      this.value = ''; // 文字列表現を保持するプロパティ
    }
    
    // イベントから初期化するメソッド
    fromEvent(e) {
      e.preventDefault();
      
      // 修飾キーの状態を更新
      this.Ctrl = e.ctrlKey;
      this.Shift = e.shiftKey;
      this.Alt = e.altKey;
      
      // キーの処理
      if (e.key === ' ') {
        this.Key = 'Space';
      } else if (e.key.length === 1) {
        this.Key = e.key.toUpperCase();
      } else if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
        this.Key = e.key;
      } else {
        this.Key = ''; // 修飾キーのみの場合
      }
      
      // 文字列表現を事前に計算して保存
      const ctrl = this.Ctrl ? 'Ctrl+' : '';
      const shift = this.Shift ? 'Shift+' : '';
      const alt = this.Alt ? 'Alt+' : '';
      this.value = this.Key ? (ctrl + shift + alt + this.Key) : '';
      
      return this;
    }
    
    // 文字列化メソッド（自動的に呼び出される場合がある）
    toString() {
      return this.value;
    }
  }
