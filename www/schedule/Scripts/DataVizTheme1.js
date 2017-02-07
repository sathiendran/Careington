// use as theme: 'newTheme'
kendo.dataviz.ui.registerTheme('snapmdTheme', {
    "chart": {
        "title": {
            "color": "#666666"
        },
        "legend": {
            "labels": {
                "color": "#666666"
            }
        },
        "chartArea": {
            "background": "#fefefe"
        },
        "seriesDefaults": {
            "labels": {
                "color": "#999999",
            },
            "overlay": {
                "gradient": "none"
            },
        },
        "axisDefaults": {
            "line": {
                "color": "#cecece"
            },
            "labels": {
                "color": "#999999",
                "font": ".7em Glober Bold"
            },
            "minorGridLines": {
                "color": "#ececec",
                "dashType": "dot",
                "width":".5"
            },
            "majorGridLines": {
                "color": "#f2f2f2",
            },
            "title": {
                "color": "#666666"
            },
            "majorTicks":{
                "size": 0
            }, 
            "minorTicks":{
                "size": 0
            } 
        },
        "valueAxis":{
            "majorGridLines": {
                "dashType": "dash"
        
        }
        },
        "seriesColors": [
            "#10c4b2",
            "#ff7663",
            "#ffb74f",
            "#a2df53",
            "#1c9ec4",
            "#ff63a5"
        ],
        "tooltip": {
            "color": "#FFF",
            "template": "${value}"
        }
    },
    "gauge": {
        "pointer": {
            "color": "#10c4b2"
        },
        "scale": {
            "rangePlaceholderColor": "#f2f2f2",
            "labels": {
                "color": "#4c5356"
            },
            "minorTicks": {
                "color": "#999999"
            },
            "majorTicks": {
                "color": "#444444"
            },
            "line": {
                "color": "#4c5356"
            }
        }
    }
});