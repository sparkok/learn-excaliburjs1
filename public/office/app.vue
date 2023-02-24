<template>
    <div id="app-l">
        <div class="app-l-container">
            <div>
                <ul class="tool-list">
                    <li v-for="(item, index) in Tools" :key="index" :class="item.id == currentTool ? 'clickStyle' : ''"
                        @click="toolChange(item)" :name="item.name">
                        <img :src="'./' + item.image" :alt="item.name" style="width: 20px; height: 20px">
                        <img src="./rightarrow.png" alt="" style="width: 30px; height: 30px" class="arrow-img">
                    </li>
                </ul>
                <div class="dividLine"></div>
                <ul class="tool-list business-tool-list">
                    <li v-for="(item, index) in actions" :key="index"
                        @click="executeAction(item)" :name="item.name">
                        <img :src="'./' + item.image" :alt="item.name" style="width: 20px; height: 20px">
                        <img src="./rightarrow.png" alt="" style="width: 30px; height: 30px" class="arrow-img">
                    </li>
                </ul>
            </div>
        </div>
</div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            Tools: [
                { "id": "move", "name": "move", "image": "move.png" },
                { "id": "zoomIn", "name": "zoomin", 'image': 'zoomin.png' },
                { "id": "zoomOut", "name": "zoomout", 'image': 'zoomout.png' },
                { "id": "terrainDetail", "name": "pin", 'image': "PinBlack.png" },
                { "id": "noop", "name": "no operation", 'image': "no.png" },
            ],
            actions: [
                { "id": "test", 'name': 'not matched', 'image': 'PinBlack.png' },
            ],
            currentTool: 'move',
            currentOperation: 'noop',
            game: null,
            objInfo: null,
            cameraInfo: null,
            cursorInfo: null,

            fileList: [],
            buninessTab: null
        }
    },
    methods: {
        toolChange(item) {
            this.currentTool = item.id;
            this.game.currentScene.toolManager.activeUITool(this.currentTool);
        },
        executeAction(action) {
            this.game.currentScene.executeAction(action.id);
        },
        doTestCase(testCase) {
            console.log("testCase: ",this)
            if(typeof testCase.action !== "undefined") {
                testCase.action.call()
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }
    },
    mounted() {
        this.game = document['game']
        this.game.on("place.object.change", (ev) => {
            this.objInfo = ev.props
            console.log("ev", ev)
        })
        this.game.on("camera.object.change", (ev) => {
            this.cameraInfo = ev.props
            console.log("ev", ev)
        })
        this.game.on("cursor.object.change", (ev) => {
            this.cursorInfo = ev.props
            console.log("ev", ev)
        })
        this.game.on("loaded", (ev) => {
            this.game.currentScene.toolManager.activeUITool(this.currentTool)
        })
    }
}
</script>

<style>
#app-l .tool-list {
    display: flex;
    flex-direction: column;
}

#app-l .business-tool-list {
    margin-top: 15px;
}

#app-l .dividLine {
    width: 40px;
    height: 3px;
    border-radius: 3px;
    background: #ddd;
    margin: 15px 0 0 5px;
}

#app-l .tool-list>li {
    position: relative;
    cursor: pointer;
    padding: 5px 10px;
    margin: 5px;
    float: left;
}

#app-l .tool-list>li img {
    filter: invert(78%)
}

#app-l .tool-list>li .arrow-img {
    position: absolute;
    left: 9px;
    top: 4px;
}

#app-l .tool-list>li:hover {
    border-left: 2px solid #6a6a6a;
    background-color: #6a6a6a;
    border-radius: 8px;
}

#app-l .tool-list>li:hover::after {
    content: attr(name);
    display: block;
    height: 26px;
    line-height: 26px;
    background-color: rgba(100, 100, 100, 1);
    color: #0b0b0b;
    padding: 0px 10px 0px 10px;
    width: max-content;
    border: 200px;
    border-radius: 0px;
    position: absolute;
    bottom: -20px;
    left: 40px;
    z-index: 999;
    border-radius: 5px;
    border: 1px solid #3c3c3c;
}

.clickStyle {
    background: #6a6a6a;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-left: 2px solid #3482f6;
}

/* upload */
#app-l .upload-container {
    background: #eeeeee;
    position: fixed;
    top: 270px;
    left: 50px;
    border-radius: 10px;
    border: 1px solid #6a6a6a;
    color: #0b0b0b;
    padding: 10px;
}
</style>