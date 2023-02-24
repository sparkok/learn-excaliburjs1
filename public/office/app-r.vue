<template>
    <div id="base-info">
        <div id="dev-tools">
        </div>
</div>
</template>
<script>
module.exports = {
    data: function () {
        return {
            currentThing:null,
            businessInfoMap: {},
            tokenOfSceneArtifect: '', //摆件token
        }
    },
    methods: {
    },
    mounted() {
        this.game = document['game']
        this.game.on("loaded", async (ev) => {
            const buninessTab = this.game.controlPanel.businessTab;
            const selectedEntityTab = this.game.controlPanel.selectedEntityTab;
            this.videoFolder = buninessTab.addFolder({
                title: '视频属性'
            });
        })
        this.game.on("place.object.change", (ev) => {
            //"thingkey":EntityStore.makeLocKey(x, y),"object":thing
            let _props = JSON.parse(ev.props);
            let _hrefSearch = window.location.search ? window.location.search.substring(1).split('&') : '';
            let _search = {};
            for (let item of _hrefSearch) {
                if (item) {
                    let _itemArr = item.split('=');
                    _search[_itemArr[0]] = _itemArr[1];
                }
            }
            this.currentThing = {
                ..._props,
                tokenOfSceneArtifect: ev.tokenOfSceneArtifect,
                tokenOfSceneGraphi: _search.sceneGraphiId || '',
            }
        })
        this.game.on("iconmenu.change", (ev) => {
            this.tokenOfSceneArtifect = ev.value;
        })
    }
}
</script>

<style>
.icon-list {
    transform: scale(0.5) translateX(-300px) translateY(-70px);
}

#base-info {
    box-sizing: border-box;
    margin-left: 10px;
}

#base-info p {
    width: 100%;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.25);
    border-bottom: 1px solid #252525;
    padding-left: 10px;
    line-height: 30px;
    color: #000;
}

#base-info .base-info-box>div {
    width: 100%;
    height: 200px;
}
</style>