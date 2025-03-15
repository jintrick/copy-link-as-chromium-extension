/**
 * クリップボードコピー機能を提供するクラス
 * @param {string} text - コピー対象のテキスト
 */
class V8Copy {
    constructor(text) {
        this.text = text;
        this.copy = this._isClipboardAvailable() ?
            this.copyWithNavigator : this.copyWithExecCommand;   
    }


    copyWithNavigator() { // -> Promise
        return navigator.clipboard.writeText(this.text)
            .then(() => true)
            .catch(() => Promise.reject(new Error('Failed to copy with navigator.clipboard')));
    }

    copyWithExecCommand() { // -> Promise
        const textarea = document.createElement('textarea');
        textarea.value = this.text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            const success = document.execCommand('copy');
            if (success) return Promise.resolve(true);
            return Promise.reject(new Error('Failed to copy with execCommand'));
        } finally {
            document.body.removeChild(textarea);
        }
    }

    copy(text = this.text) { // -> Promise
        this.text = text;
        return this.copyWithNavigator()
            .catch(() => this.copyWithExecCommand());
    }

    _isClipboardAvailable() {
        return navigator.clipboard && window.isSecureContext;
    }

}

// 使用例
// const copier = new V8Copy('Copy me!');
// copier.copy()
//   .then(() => console.log('Copy success!'))
//   .catch(() => console.error('Copy failed!'));

