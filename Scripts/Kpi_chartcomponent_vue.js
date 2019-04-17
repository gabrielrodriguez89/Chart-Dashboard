$(function () {
    Vue.component('chart-component', {
        props: ['chart-data'],
        data: function () {
            return {
                // start of drag
                xCordinate: 0,
                yCordinate: 0,
                xDragPosition: 0,
                yDragPosition: 0,
                dragging: false,
                // end of drag
                chart: null,
                originalChartData: null,
                highChart: null,
                overlayOpen: false,
                isActive: true,
                openTab: null,
                activeEditor: false,
                showSeries: false,
                showDataSetEditor: false,
                newXLabel: "",
                newTotal: "",
                newGoal: "",
                newDatasetName: "",
                seriesActive: false,
                pointsToShow: 4,
                activeTab: 'options',
                editAllSeries: false,
                seriesAdded: false,
                pinned: true,
                editTable: false,
                deleteBySelection: false,
                isChecked: false,
                fullScreen: false,
                sortOrder: null
            };
        },
        computed: {
            disableSave: function () {
                if (this.Series === null) {
                    return null;
                }
                return this.chart.DataSets[0].Points.length === 0;
            },
           
            dirty: function () {
                return !this.chart.Id || !_.isEqual(this.chart, this.chartData) || !_.isEqual(this.chart, this.originalChartData);
            },
            dirtyAddDataSets: function () {
                if (this.Series === null) {
                    return null;
                }
                return this.newDatasetName !== "" && this.chart.DataSets[0].Points[0].X !== "";
            },
            highChartModel: function () {
                if (!this.chart || this.chart.ChartType === 'table') {
                    return null;
                }
                return {
                    title: {
                        text: this.chart.Title
                    },
                    subtitle: {
                        text: this.chart.Subtitle
                    },
                    legend: {
                        enabled: !!this.chart.Legend
                    },
                    //colors: null, (will do self later)
                    credits: {
                        enabled: false
                    },
                    series: this.Series,
                    plotOptions: this.PlotOptions,
                    xAxis: this.XAxis,
                    yAxis: this.YAxis,
                    chart: {
                        type: this.chart.ChartType
                    }
                };
            },
            PlotOptions: function () {
                switch (this.chart.ChartType) {
                    case "line":
                        return {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        };
                    case "column":
                        return {
                            column: {
                                borderWidth: 0,
                                pointPadding: 0.2
                            }
                        };
                    case "pie":
                        return {};
                    default:
                        return null;
                }
            },
            XAxis: function () {
                if (this.Series === null) {
                    return null;
                }
                var points = this.chart.DataSets[0].Points;
                switch (this.chart.ChartType) {
                    case "line":
                    case "column":
                        return {
                            categories: _.map(_.takeRight(points,
                                this.pointsToShow),
                                function (p) {
                                    if (p.X === null) {
                                        return null;
                                    }
                                    return p.X.toString();
                                })
                        };
                    case "pie":
                    default:
                        return null;
                }
            },
            YAxis: function () {
                if (this.Series === null) {
                    return null;
                }
                switch (this.chart.ChartType) {
                    case "line":
                    case "column":
                        return {
                            title: {
                                text: this.chart.YAxisLabel
                            }
                        };
                    case "pie":
                    default:
                        return null;
                }
            },
            Series: function () {
                var self = this;
                var datasets = self.chart.DataSets;
                if (datasets.length === 0 || datasets === null) {
                    return null;
                }
                if (self.chart.ChartType === "pie") {
                    datasets = [datasets[0]];
                }
                var pointsToShow = self.chart.ChartType === "pie"
                    ? datasets[0].Points.length
                    : self.pointsToShow;
                return _.map(datasets,
                    function (ds) {
                        //var sortedDescDatapoints = _.sortBy(ds.Points, ['X', 'Y'], ['asc', 'desc']);
                        return {
                            name: ds.Name,
                            //colorByPoint: null, will do that later
                            column: null,
                            label: null,
                            data: _.map(_.takeRight(ds.Points, pointsToShow),
                                function (p) {
                                    switch (self.chart.ChartType) {
                                        case "line":
                                            return {
                                                name: ds.Name,
                                                y: parseInt(p.Y)
                                            };
                                        case "column":
                                        case "pie":
                                            return {
                                                name: p.X === null ? "" : p.X.toString(),
                                                y: parseInt(p.Y)
                                            };
                                        default:
                                            return null;
                                    }
                                })
                        };
                    });
            },
            isChart: function () {
                return this.chart.ChartType !== 'table';
            }
        },
        methods: {
            // init drag event for charts
            dragElement: function (e) {
                if (!this.pinned) {
                    this.dragging = true;
                    this.xDragPosition = e.clientX;
                    this.yDragPosition = e.clientY;
                }
            },
            // follow cursor while dragging
            drag: function (evt) {
                if (!this.pinned && this.dragging) {
                    evt = evt || window.event;
                    evt.preventDefault();
                    var self = this;
                    var tempY = "";
                    var tempX = "";

                    self.xCordinate = self.xDragPosition - evt.clientX;
                    self.yCordinate = self.yDragPosition - evt.clientY;
                    self.xDragPosition = evt.clientX;
                    self.yDragPosition = evt.clientY;
                    tempY = evt.currentTarget.offsetTop - self.yCordinate + "px";
                    tempX = evt.currentTarget.offsetLeft - self.xCordinate + "px";
                    evt.currentTarget.style.top = tempY;
                    evt.currentTarget.style.left = tempX;
                }
            },
            // reset values for drag event
            closeDragElement: function () {
                if (!this.pinned) {
                    this.dragging = false;
                    this.xDragPosition = this.yDragPosition = 0;
                }
            },
            // pin chart admin tool
            pinChart: function () {
                this.pinned = !this.pinned;
            },
            // toggle events
            toggleTab: function (val) {
                if (val === this.openTab) {
                    this.openTab = null;
                } else {
                    this.openTab = val;
                }
            },
            toggleChartOption: function () {
                this.activeOptions = !this.activeOptions;
                this.activeEditor = !this.activeEditor;
            },
            toggleChartEdit: function () {
                this.activeOptions = !this.activeOptions;
                this.activeEditor = !this.activeEditor;
            },
            toggleOverlay: function () {
                this.overlayOpen = !this.overlayOpen;

            },
            toggleDarkMode: function () {
                this.isActive = !this.isActive;
            },
            toggleSeriesDisplay: function () {
                this.seriesActive = !this.seriesActive;
            },
            toggleTableEditor: function () {
                this.editTable = !this.editTable;
            },
            openModal: function () {
                this.$emit("my-emma-import", this.chart.Id, this.chart.CategoryId);
                $('#my-emma').modal('show');
            },
            // used to edit the input fields for the total clicks on all charts
            changePoint: function (point, dataIndex, series) {
                if (!isNaN(parseInt(point)) && Series !== null) {
                    series.Points[dataIndex].Y = parseInt(point);
                    this.redrawChart();
                }
            },
            displayEditor: function () {
                this.showSeries = true;
                this.editAllSeries = true;
            },
            addDataset: function () {
                this.showDataSetEditor = !this.showDataSetEditor;
                this.showSeries = !this.showSeries;
                this.newDatasetName = "";
            },
            revertEdits: function () {
                var self = this;

                if (confirm("If you cancel you will lose all changes, would you like to continue?")) {
                    self.chart = _.cloneDeep(self.chartData);
                    self.resetAdminToolDisplay();
                }
            },
            // add points to the chart
            showMoreSeries: function () {
                if (this.chart.DataSets[0].Points.length > this.pointsToShow) {
                    this.pointsToShow++;
                }
            },
            // remove points from the chart
            showLessSeries: function () {
                if (this.pointsToShow > 1) {
                    this.pointsToShow--;
                }
            },
            // add empty fields to add new month and display
            addNewDataset: function () {
                var self = this;
                this.showDataSetEditor = false;
                var defaultVal = self.Series === null;

                var totalPoints = defaultVal ? 1 : self.chart.DataSets[0].Points.length;

                // set new series name
                self.chart.DataSets.push({
                    Name: self.newDatasetName,
                    Points: []
                });

                // get new length of series
                var totalSeries = self.chart.DataSets.length - 1;
                // loop through the point count to set blank data fields to match the others length
                for (var i = 0; i < totalPoints; i++) {
                    var x = defaultVal ? "" : self.chart.DataSets[0].Points[i].X;
                    self.chart.DataSets[totalSeries].Points.push({ X: x, Y: 0 });
                }
                self.editAllSeries = true;
                self.showSeries = true;
            },
            addNewMonth: function () {
                if (this.Series === null) {
                    return null;
                }
                var self = this;
                var length = self.chart.DataSets.length;
                // set new series name
                for (var i = 0; i < length; i++) {
                    self.chart.DataSets[i].Points.push({
                        X: "",
                        Y: 0
                    });
                }
                self.editAllSeries = true;
                self.showSeries = true;
            },
            toggleDataPoints: function () {
                this.redrawChart();
            },
            redrawChart: function () {
                if (this.highChart) {
                    this.highChart.destroy();
                }
                if (this.highChartModel) {
                    this.highChart = Highcharts.chart(this.$refs.chartDiv, this.highChartModel);
                } else {
                    this.highChart = null;
                }
            },
            cloneData: function () {
                this.originalChartData = _.cloneDeep(this.chartData);
                this.chart = _.cloneDeep(this.chartData);
            },
            // reset values after revert or save
            resetAdminToolDisplay: function () {
                this.showSeries = false;
                this.showDataSetEditor = false;
                this.openTab = null;
                this.editAllSeries = false;
                this.seriesAdded = false;
            },
            // call to revert based on bool value set ( this is used in multiple cancel buttons)
            cancelChanges: function () {
                var self = this;

                self.revertEdits();

                self.resetAdminToolDisplay();
            },
            // ajax call to save all chart changes as contract
            saveChanges: function () {
                var self = this;

                if (this.chart.AdditionalContent.Content !== this.chartData.AdditionalContent.Content) {
                    this.chart.AdditionalContent = _.cloneDeep(this.chartData.AdditionalContent);
                }
                Messenger().run({
                    action: $.ajax,
                    successMessage: "Chart has been saved",
                    errorMessage: "There was an error saving.",
                    progressMessage: "Saving..."
                },
                    {
                        method: self.chart.Id ? "PUT" : "POST",
                        url: self.chart.Id
                            ? "/KpiDashboard/EditKPIChart"
                            : "/KpiDashboard/CreateKPIChart",

                        data: self.chart,
                        success: function (newId) {
                            if (Number.isInteger(newId)) {
                                self.chart.Id = newId;
                                self.$emit("chart-updated", newId, self.chart.CategoryId);
                            }
                            self.chartData = _.cloneDeep(self.chart);
                            self.originalChartData = _.cloneDeep(self.chart);
                            self.resetAdminToolDisplay();
                        }
                    });
            },
            // deletes all corresponding points 1 quarter or month at a time
            deletePoints: function (point) {
                var self = this;

                if (confirm(
                    "By deleting this field, all corresponding fields will also be deleted. Would you like to continue?")
                ) {
                    _.forEach(self.chart.DataSets,
                        function (s) {
                            var i = _.findIndex(s.Points,
                                function (p) {
                                    return p.X === point.X;
                                });
                            if (i !== null) {
                                s.Points.splice(i, 1);
                            }
                        });
                }
            },
            deleteDataPoints: function () {
                this.deleteBySelection = !this.deleteBySelection;
            },
            deleteDataSet: function (index) {
                var self = this;

                if (confirm(
                    "By deleting this column, all corresponding data will also be deleted. Would you like to continue?")
                ) {
                    self.chart.DataSets.splice(index, 1);
                }
            },
            sortDatasets: function (order, dataset) {
                var self = this;
                var reverseOrder = order === "asc";
                var nullSet = dataset === null;
                var data = nullSet ? self.chart.DataSets : dataset;
                var sortOrder = reverseOrder ? ['asc'] : ['desc'];
                var sorted = _.map(data,
                    function (ds) {
                        var sort = reverseOrder
                            ? _.sortBy(ds.Points, ['X', 'Y'], sortOrder)
                            : _.sortBy(ds.Points, ['X', 'Y'], sortOrder).reverse();
                        return {
                            Name: ds.Name,
                            Points: _.map(sort,
                                function (p) {
                                    return {
                                        X: p.X,
                                        Y: p.Y
                                    };
                                })
                        };
                    });
                if (self.sortOrder === null) {
                    self.sortOrder = order;
                } else {
                    self.sortOrder = self.sortOrder === 'asc' ? 'desc' : 'asc';
                }
                if (nullSet) {
                    self.chart.DataSets = sorted;
                    return null;
                } else {
                    return sorted;
                }
            }
        },
        created: function () {
            if (this.chart === null) {
                this.chartData.DataSets = this.sortDatasets('asc', this.chartData.DataSets);
                this.cloneData();
            }
        },
        mounted: function () {
      
            if (this.highChartModel) {
                this.highChart = Highcharts.chart(this.$refs.chartDiv, this.highChartModel);
            }
            window.addEventListener('mouseup', this.closeDragElement());
        },
        watch: {
            chart: {
                handler: function (newVal) {
                    this.redrawChart();

                    // check to see if the X label changed on any point
                    if (newVal.DataSets.length > 0) {
                        var firstSet = newVal.DataSets[0];
                        _.forEach(_.takeRight(newVal.DataSets, newVal.DataSets.length - 1),
                            function (d) {
                                // set each point's X value to the first set's
                                for (var i = 0; i < d.Points.length; i++) {
                                    d.Points[i].X = firstSet.Points[i].X;
                                }
                            });
                    }
                },
                deep: true
            },
            pointsToShow: function () {
                this.redrawChart();
            }
        },
        template: 
        '<div class="port-chart" style="width: 100%;">'
	+ '<div class="btn-group-inline chart-btn-group" v-show="!overlayOpen">'
			+ '<button data-toggle="tooltip" title="Edit Chart" @click="toggleOverlay" class="port-chart-button"><span class="glyphicon glyphicon-cog"></span></button>'
			+ '<button data-toggle="tooltip" title="Delete Chart" @click="$emit(\'chart-deleted\')" class="port-chart-button"><span class="glyphicon glyphicon-trash text-danger"></span></button>'
			+ '<button v-if="chart.CategoryId === 1" class="myemma-btn" @click="openModal"> <span>Import</span></button>'
		+ '<h4 v-if="chart.Id === 0 || dirty" class="text-center text-danger " style="margin: 0; " > <span class="glyphicon glyphicon-exclamation-sign text-danger"></span>SAVE CHANGES BEFORE EXITING</h4>'
	+ '</div>'
	+ '<div :class="[\'drag-div\', {dark: isActive}]" @mousedown="dragElement" @mousemove="drag" @mouseup="closeDragElement" >'
	+ '<div class="chart-overlay" v-show="overlayOpen">'
		+ '<div class="chart-content">'
			+ '<div class="button-group-inline top-icon">'
				+ '<div class="pull-right" data-toggle="tooltip" title="Close" @click="toggleOverlay">'
					+ '<span class="fa fa-close" data-toggle="tooltip" data-placement="bottom" title="close"></span>'
				+ '</div>'
				+ '<div class="pull-right" @click="toggleDarkMode" v-show="!isActive">'
					+ '<span class="fa fa-moon-o" data-toggle="tooltip" data-placement="bottom" title="Dark Mode"></span>'
				+ '</div>'
				+ '<div class="pull-right" @click="toggleDarkMode" v-show="isActive">'
					+ '<span class="fa fa-sun-o" data-toggle="tooltip" data-placement="bottom" title="Light Mode"></span>'
				+ '</div>'
				+ '<div :class="[\'pull-right\', {pin: pinned}]" @click="pinChart" >'
					+ '<span class="fa fa-thumb-tack" data-toggle="tooltip" data-placement="bottom" title="Pin Window"></span>'
				+ '</div>'
			+ '</div>'
			+ '<form action="#" method="post" :id="chart.Title">'
				+ '<div class="overlay-form">'
					+ '<div>'
						+ '<div class="edit-options">'
							+ '<span @click.prevent="activeTab = \'options\'" :class="[\'tab-content\', {activated: activeTab === \'options\'}]" data-toggle="tooltip" data-placement="bottom" title="Chart Config">Options</span>'
							+ '<span @click.prevent="activeTab = \'edit\'" :class="[\'tab-content\', {activated: activeTab === \'edit\'}]" data-toggle="tooltip" data-placement="bottom" title="Edit Series">Edit</span>'
						+ '</div>'
						+ '<div class="overlay-chart-title"><h1>{{ chart.Title }}</h1> </div>'
							+ '<div class="options-chart">'
								+ '<div v-show="activeTab === \'options\'">'
									+ '<div class="form-horizontal">'
										+ '<div class="form-group">'
											+ '<div class="toggle-series" @click="toggleSeriesDisplay" v-if="Series !== null">'
												+ '<label>Most Recent Points to Show</label>'
												+ '<div class="toggle-series">'
                                                + '<span data-toggle="tooltip" data-placement="bottom" title="Show Less" :class="[\'glyphicon\', \'glyphicon-minus\', \'text-danger\', {\'disabled\': pointsToShow === 1 }]"'
                                                + '@click="showLessSeries"></span>'
													+ '<strong>{{ pointsToShow }}</strong>'
													+ '<span data-toggle="tooltip" data-placement="bottom" title="Show More" '
													+ ':class="[\'glyphicon\', \'glyphicon-plus\', \'text-success\', {\'disabled\': pointsToShow === chart.DataSets[0].Points.length }]" @click="showMoreSeries"></span>'
												+ '</div>'
											+ '</div>'
										+ '</div>'
									+ '</div>'
									+ '<label>Type</label>'
									+ '<select v-model="chart.ChartType">'
										+ '<option disabled="disabled" value="">Graph Type</option>'
										+ '<option selected>line</option>'
										+ '<option>column</option>'
										+ '<option>pie</option>'
										+ '<option>table</option>'
									+ '</select>'
									+ '<div class="checkbox" v-show="isChart">'
										+ '<label>'
											+ '<input type="checkbox" v-model="chart.Legend" />'
											+ '<strong>Legend</strong>'
										+ '</label>'
									+ '</div>'
									+ '<div class="form-group">'
										+ '<label>XAxis</label>'
										+ '<input v-model="chart.XAxisLabel" type="text" class="form-control" />'
									+ '</div>'
									+ '<div class="form-group">'
										+ '<label>YAxis</label>'
										+ '<input v-model="chart.YAxisLabel" type="text" class="form-control" />'
									+ '</div>'
									+ '<div class="form-group">'
										+ '<label>Title</label>'
										+ '<input v-model="chart.Title" type="text" class="form-control" />'
									+ '</div>'
									+ '<div class="form-group">'
										+ '<label>Subtitle</label>'
										+ '<input v-model="chart.Subtitle" type="text" class="form-control" />'
									+ '</div>'
								+ '</div>'
							+ '</div>'
							+ '<div class="edit-chart">'
								+ '<div class="data-editor" v-show="activeTab === \'edit\'">'
									+ '<div class="edit-all-series" v-if="Series === null">'
										+ '<table class="table">'
											+ '<thead>'
												+ '<tr>'
													+ '<th>'
														+ '<div class="add-more-btn-grp">'
															+ '<div class="btn-group">'
                                                                + '<button class="btn btn-default pull-right" data-toggle="tooltip" data-placement="bottom" v-if="openTab === null && !showDataSetEditor" title="Add Dataset"'
                                                                + '@click.prevent="addNewDataset"><span class="glyphicon glyphicon-plus text-success pull-right"></span></button>'
															+ '</div>'
														+ '</div>'
													+ '</th>'
												+ '</tr>'
											+ '</thead>'
											+ '<tbody>'
												+ '<tr>'
													+ '<td></td>'
												+ '</tr>'
											+ '</tbody>'
										+ '</table>'
									+ '</div>'
									+ '<div class="edit-all-series" v-if="Series !== null">'
										+ '<div class="button-group">'
											+ '<span v-if="sortOrder === \'desc\'" class="glyphicon glyphicon-sort-by-attributes" data-toggle="tooltip" data-placement="bottom" title="Sort By Ascending" '
											+ '@click="sortDatasets(\'asc\', null)"></span>'
                                            + '<span v-if="sortOrder === \'asc\'" class="glyphicon glyphicon-sort-by-attributes-alt" data-toggle="tooltip" data-placement="bottom" title="Sort By Descending"'
                                            + '@click="sortDatasets(\'desc\', null)"></span>'
										+ '</div>'
										+ '<table class="table">'
											+ '<thead>'
												+ '<tr>'
													+ '<th><input class="form-control" type="text" v-model="chart.XAxisLabel" placeholder="X-Axis Label" /></th>'
                                                    + '<th v-for="(n, i) in chart.DataSets"><span class="glyphicon glyphicon-trash text-danger delete-series" data-toggle="tooltip" data-placement="bottom" title="Delete"'
                                                    + '@click="deleteDataSet(i)"></span><input class="form-control" type="text" v-model="n.Name" /></th>'
													+ '<th>'
														+ '<div class="add-more-btn-grp">'
															+ '<div class="btn-group">'
                                                            + '<button class="btn btn-default" data-toggle="tooltip" data-placement="bottom" v-if="openTab === null && !showDataSetEditor" title="Add Dataset"'
                                                            + '@click.prevent="addNewDataset"><span class="glyphicon glyphicon-plus text-success"></span></button>'
															+ '</div>'
														+ '</div>'
													+ '</th>'
												+ '</tr>'
											+ '</thead>'
											+ '<tbody>'
												+ '<tr v-for="(p, i) in chart.DataSets[0].Points">'
													+ '<td><input type="text" v-model="p.X " class="form-control" placeholder="Month/Point Name" /></td>'
													+ '<td v-for="s in chart.DataSets"><input class="form-control" type="text" v-model="s.Points[i].Y " /></td>'
													+ '<td>'
                                                    + '<span v-if="!deleteBySelection" class="glyphicon glyphicon-trash text-danger delete-points" data-toggle="tooltip" data-placement="bottom" title="Delete"'
                                                    + '@click="deletePoints(p)"></span>'
													+ '</td>'
												+ '</tr>'
											+ '</tbody>'
										+ '</table>'
										+ '<div class="add-more-btn-grp add-points">'
											+ '<div class="btn-group">'
                                            + '<button class="btn btn-default" data-toggle="tooltip" data-placement="bottom" v-if="openTab === null && !showDataSetEditor" title="Add Month" @click.prevent="addNewMonth">'
                                            + '<span class="glyphicon glyphicon-plus text-success"></span></button>'
											+ '</div>'
										+ '</div>'
									+ '</div>'
									+ '<hr />'
								+ '</div>'
							+ '</div>'
						+ '</div>'
						+ '<div class="text-danger text-center">'
							+ '<h4 v-if="disableSave && Series !== null"><span class="glyphicon glyphicon-exclamation-sign"></span> <strong>You need one set of points in the chart in order to save.</strong></h4>'
							+ '<h4 v-if="Series === null"><span class="glyphicon glyphicon-exclamation-sign"></span> <strong>You have no data points saved, please add a new dataset or delete the chart to continue.</strong></h4>'
						+ '</div>'
						+ '<div v-if="!editAllSeries && showSeries && !seriesAdded && activeTab !== \'options\' " class="pull-right add-series-btn-group">'
							+ '<div class="btn-group-inline">'
								+ '<span @click.prevent="addDataset" @keydown.enter="addNewMonth" class="glyphicon glyphicon-remove text-danger" data-toggle="tooltip" data-placement="bottom" title="Cancel"></span>'
								+ '<span @click.prevent="addNewDataset" class="glyphicon glyphicon-ok text-success add-series-btn " data-toggle="tooltip" data-placement="bottom" title="Save"></span>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</form>'
			+ '</div>'
		+ '</div>'
	+ '</div>'
	+ '<div ref="chartDiv" v-show="isChart && Series !== null"></div>'
		+ '<div v-if="!isChart && Series !== null">'
		+ '<br />'
		+ '<div>'
			+ '<strong>{{ chart.Title }}</strong>'
			+ '<span v-if="!editTable" class="glyphicon glyphicon-edit edit-table pull-right" @click="toggleTableEditor"></span>'
			+ '<span v-if="editTable" class="glyphicon glyphicon-remove text-danger edit-table pull-right" @click="toggleTableEditor"></span>'
		+ '</div>'
		+ '<hr /> <br />'
		+ '<table v-if="!editTable && Series !== null" class="table table-striped">'
			+ '<thead>'
				+ '<tr>'
					+ '<th>{{ chart.XAxisLabel }}</th>'
					+ '<th v-for="n in chart.DataSets">{{ n.Name }}</th>'
				+ '</tr>'
			+ '</thead>'
			+ '<tbody>'
				+ '<tr v-for="(p, i) in _.takeRight(chart.DataSets[0].Points, pointsToShow)">'
					+ '<td>{{ p.X }}</td>'
					+ '<td v-for="s in chart.DataSets">{{ s.Points[s.Points.length - pointsToShow + i].Y }}</td>'
				+ '</tr>'
			+ '</tbody>'
		+ '</table>'
		+ '<table v-if="editTable && Series !== null" class="table">'
			+ '<thead>'
				+ '<tr>'
					+ '<th><input class="form-control" type="text" v-model="chart.XAxisLabel" placeholder="X-Axis Label" /></th>'
					+ '<th v-for="n in chart.DataSets"><input class="form-control" type="text" v-model="n.Name" /></th>'
				+ '</tr>'
			+ '</thead>'
			+ '<tbody>'
				+ '<tr v-for="(p, i) in chart.DataSets[0].Points" :class="{\'bg-info\': i < (chart.DataSets[0].Points.length - pointsToShow) }">'
					+ '<td><input type="text" v-model="p.X " class="form-control" /></td>'
					+ '<td v-for="s in chart.DataSets"><input class="form-control" type="text" v-model="s.Points[i].Y" /></td>'
				+ '</tr>'
			+ '</tbody>'
		+ '</table>'
	+ '</div>'
	+ '<div class="btn-group-inline save" v-show="editAllSeries || dirty && !seriesAdded && !showSeries" v-if="Series !== null">'
		+ '<button type="button" class="btn btn-danger email-form-submit-btn pull-left" :disabled="chart.Id === 0 || !dirty  " @click.prevent="cancelChanges">'
			+ 'Revert'
		+ '</button>'
		+ '<button type="button" class="btn btn-success email-form-submit-btn pull-right" :disabled="!dirty || disableSave " @click.prevent="saveChanges" >'
			+ 'Save'
		+ '</button >'
	+ '</div>'
+ '</div>'
    });
});
