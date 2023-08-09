<script setup lang="ts">
import 'echarts/map/js/china'
import { ref, onMounted, computed } from 'vue'
// 使用 ECharts 提供的按需引入的接口来打包必须的组件
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts'
/*
  需要注意的是为了保证打包的体积是最小的，ECharts 按需引入的时候不再提供任何渲染器，
  所以需要选择引入 CanvasRenderer 或者 SVGRenderer 作为渲染器。这样的好处是假如
  你只需要使用 svg 渲染模式，打包的结果中就不会再包含无需使用的 CanvasRenderer 模块
*/
const chart = ref()
const chinaMapChart = ref()

interface Props {
    businessData: any // 树图数据源
    width?: string | number // 容器宽度
    height?: string | number // 容器高度
}
const props = withDefaults(defineProps<Props>(), {
    businessData: () => { return {} },
    width: '100%',
    height: '100%'
})

const chartWidth = computed(() => {
    if (typeof props.width === 'number') {
        return props.width + 'px'
    } else {
        return props.width
    }
})
const chartHeight = computed(() => {
    if (typeof props.height === 'number') {
        return props.height + 'px'
    } else {
        return props.height
    }
})

onMounted(() => {
    initChart() // 初始化图标示例
    // 监听树图节点的点击事件
    chinaMapChart.value.on('click', onClick)
})
const emit = defineEmits(['clickCityNode'])
function onClick(e: any) {
    emit('clickCityNode', e.data)
}
function initChart() {
    // 等价于使用 Canvas 渲染器（默认）：echarts.init(containerDom, null, { renderer: 'canvas' })
    chinaMapChart.value = echarts.init(chart.value)

    let option = {
        title: {
            text: '全国业务模块地图',
            x: 'center'
        },
        tooltip: {
            show: false
        },
        geo: {
            map: "china",
            roam: false,//关闭拖拽
            zoom: 1.24,
            center: [104.2, 36],//调整地图位置
            label: {
                normal: {
                    show: false,//关闭省份名展示
                    fontSize: "10",
                    color: "rgba(0,0,0,0.7)"
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: "#0d0059",
                    borderColor: "#389dff",
                    borderWidth: 1,//设置外层边框
                    shadowBlur: 5,
                    shadowOffsetY: 8,
                    shadowOffsetX: 0,
                    shadowColor: "#01012a"
                },
                emphasis: {
                    areaColor: "#184cff",
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 5,
                    borderWidth: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        },
        series: [
            {
                type: "map",
                map: "china",
                roam: false,
                zoom: 1.24,
                center: [104.2, 36],
                showLegendSymbol: false,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: "#0d0059",
                        borderColor: "#389dff",
                        borderWidth: 0.5
                    },
                    emphasis: {
                        areaColor: "#17008d",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 5,
                        borderWidth: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            },
            {
                name: "",
                type: "scatter",
                coordinateSystem: "geo",
                data: [],
                symbol: "circle",
                symbolSize: 5,
                hoverSymbolSize: 10,
                tooltip: {
                    formatter(value: any) {
                        return value.data.name + "<br/>" + "服务医院数：" + value.data.count
                    },
                    show: true
                },
                encode: {
                    value: 2
                },
                label: {
                    formatter: "{b}",
                    position: "right",
                    show: false
                },
                itemStyle: {
                    color: "#0efacc"
                },
                emphasis: {
                    label: {
                        show: false
                    }
                }
            },
            {
                name: "Top 5",
                type: "effectScatter",
                coordinateSystem: "geo",
                data: [],
                symbol: "circle",
                symbolSize: 12,
                tooltip: {
                    formatter(value:any) {
                        return value.data.name + "<br/>" + "服务医院数：" + value.data.count
                    },
                    show: true
                },
                encode: {
                    value: 2
                },
                showEffectOn: "render",
                rippleEffect: {
                    brushType: "stroke",
                    color: "#0efacc",
                    period: 9,
                    scale: 5
                },
                hoverAnimation: true,
                label: {
                    formatter: "{b}",
                    position: "right",
                    show: true
                },
                itemStyle: {
                    color: "#0efacc",
                    shadowBlur: 2,
                    shadowColor: "#333"
                },
                zlevel: 1
            }
        ]
    }
    option.series[1].data = props.businessData
    option.series[2].data = props.businessData.splice(0, 5)
    option && chinaMapChart.value.setOption(option)
}
</script>
<template>
    <div ref="chart" :style="`width: ${chartWidth}; height: ${chartHeight};`"></div>
</template>