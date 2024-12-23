function QSTabsWxsListMixin(){
	return {
		props: {
			tab: {
				type: [Object, String],
				default () {
					return {}
				}
			},
			index: { // 保证性能勿删
				type: [String, Number],
				default: ''
			},
			current: { // 保证性能勿删
				type: [String, Number],
				default: ''
			},
			type: {
				type: String,
				default: ''
			},
			show: {
				type: [Boolean, String],
				default: false
			},
			readyRefresh: {
				type: [Boolean, String],
				default: false
			}
		},
		data() {
			return {
				scrollTop: 0, // 保证性能勿删
				oldScrollTop: 0, // 保证性能勿删
				setScrollTopcount: 0, // 保证性能勿删
				scrollTimeout: null
			}
		},
		watch: {
			// 保证性能勿删
			show(newValue, oldValue) {
				if (newValue === true) {
					this.toOldScrollTop();
				}
			}
		},
		computed: {
			// 保证性能勿删
			getShow() {
				return String(this.show)==='true';
			},
			getFixedClass() {
				// #ifndef MP
				return String(this.readyRefresh)==='true'&&String(this.getShow)==='true'?'freeze':'';
				// #endif
				// #ifdef MP
				return '';
				// #endif
			}
		},
		methods: {
			scrollFn(e) { // 保证性能勿删
				if (e.detail.scrollTop !== 0) {
					if(this.scrollTimeout){ 
						clearTimeout(this.scrollTimeout);
					}
					this.scrollTimeout = setTimeout(()=>{
						this.oldScrollTop = e.detail.scrollTop;
					}, 100);
					
				}
			},
			toOldScrollTop() { // 保证性能勿删
				this.$nextTick(() => {
					setTimeout(() => {
						this.scrollTop = (this.setScrollTopcount++ % 2 === 0) ? this.oldScrollTop + 1 : this.oldScrollTop - 1;
					}, 0)
				})
			}
		}
	}
}

module.exports = {
	QSTabsWxsListMixin
}