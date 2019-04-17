var flowNum = 0,
comboNo=0;

function _(x) {
	return document.getElementById(x);
}

function fillData(elid, elimg, eltext) {
	_(elid).innerHTML = '<img class="output_image" src="./images/'+ elimg +'.png"> ' + eltext;
}

// fillData("fd_liabla", "yes", "Customer bla");

function disableInputFields(id,val){
	document.getElementById(id).value = val.trim();
	var ele_handle;
	if(id == "order no" || id == "order item no" ){
		if(val != ""){
			comboNo = 1;
			ele_handle = document.getElementById("sold to no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
			ele_handle = document.getElementById("ship to no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
			ele_handle = document.getElementById("material no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
		}else{
			if(document.getElementById("order no").value == "" && document.getElementById("order item no").value == ""){
				comboNo = 0;
				ele_handle = document.getElementById("sold to no");
				ele_handle.value = "";
				ele_handle.disabled = "";
				ele_handle = document.getElementById("ship to no");
				ele_handle.value = "";
				ele_handle.disabled = "";
				ele_handle = document.getElementById("material no");
				ele_handle.value = "";
				ele_handle.disabled = "";
			}
		}
	}else if(id == "sold to no"){
		if(val != ""){
			comboNo = 2;
			ele_handle = document.getElementById("order no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
			ele_handle = document.getElementById("order item no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
			ele_handle = document.getElementById("ship to no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
		}else{
			comboNo = 0;
			ele_handle = document.getElementById("order no");
			ele_handle.value = "";
			ele_handle.disabled = "";
			ele_handle = document.getElementById("order item no");
			ele_handle.value = "";
			ele_handle.disabled = "";
			ele_handle = document.getElementById("ship to no");
			ele_handle.disabled = "";
			ele_handle.value = "";
		}
	}else if(id == "ship to no"){
		if(val != ""){
			comboNo = 3;
			ele_handle = document.getElementById("order no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
			ele_handle = document.getElementById("order item no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
			ele_handle = document.getElementById("sold to no");
			ele_handle.value = "";
			ele_handle.disabled = "disabled";
		}else{
			comboNo = 0;
			ele_handle = document.getElementById("order no");
			ele_handle.value = "";
			ele_handle.disabled = "";
			ele_handle = document.getElementById("order item no");
			ele_handle.value = "";
			ele_handle.disabled = "";
			ele_handle = document.getElementById("sold to no");
			ele_handle.disabled = "";
			ele_handle.value = "";
		}
	}else if(id == "material no"){
		if(val != ""){
			if(document.getElementById("sold to no").value == "" && document.getElementById("ship to no").value == ""){
				ele_handle = document.getElementById("order no");
				ele_handle.value = "";
				ele_handle.disabled = "disabled";
				ele_handle = document.getElementById("order item no");
				ele_handle.value = "";
				ele_handle.disabled = "disabled";
			}
		}else{
			if(document.getElementById("sold to no").value == "" && document.getElementById("ship to no").value == ""){
				ele_handle = document.getElementById("order no");
				ele_handle.value = "";
				ele_handle.disabled = "";
				ele_handle = document.getElementById("order item no");
				ele_handle.value = "";
				ele_handle.disabled = "";
			}
		}
	}
}

function validate_fields(){
	var year = document.getElementById("year").value;
	var week = document.getElementById("week").value;
	if (year=="" || week==""){
		swal("Missing Data!", "Mandatory fields cannot be blank!");
	}else{
		try{
			init_app();
		}catch(e){
			console.log(e);
			alert("Something went wrong!");
		}
	}
}

function validate_shipto_soldto_num(id,val){
	val = val.trim();
	var isnum = /^\d+$/.test(val);
	var final_val="";
	if (isnum==true){
		var len_diff=10-val.length;
		for(var i=0; i<len_diff; i++){
			final_val+="0";
		}
		final_val+=val;
	}else{
		final_val=val;
	}
	document.getElementById(id).value=final_val;
	disableInputFields(id,final_val);
}

function validate_order_item_no(id,val){
	val = val.trim();
	var isnum = /^\d+$/.test(val);
	var final_val="";
	if (isnum==true){
		var len_diff=6-val.length;
		for(var i=0; i<len_diff; i++){
			final_val+="0";
		}
		final_val+=val;
	}
	document.getElementById("order item no").value=final_val;
	disableInputFields(id,final_val);
}

function selectViz(vizContainerName,SheetName, newOptions){
	var viz, keyName;
	var containerDiv = document.getElementById(vizContainerName),
		url = "https://insights.connect.te.com/t/TransportationSegment/views/LiabilityTrackerJStest3/"+SheetName,	//append sheet name to url which has workbook name
        options = {
            hideTabs: true,
            hideToolbar: true,
            onFirstInteractive: function () {
				getSummaryData(viz);
            }
        };
		for (keyName in newOptions){options[keyName]=newOptions[keyName];}	//populate new options to existing options
    viz = new tableau.Viz(containerDiv, url, options);
}

function getSummaryData(viz){
	var sheet = viz.getWorkbook().getActiveSheet();
    options = {
        maxRows: 0, // Max rows to return. Use 0 to return all rows
        ignoreAliases: false,
        ignoreSelection: true,
        includeAllColumns: false
    };
	
    sheet.getSummaryDataAsync(options).then(function(t){
		var table = t;
		// var tgt = document.getElementById("dataTarget");
		var jsonData = JSON.stringify(table.getData());
		// if(flowNum==0){document.getElementById("datatarget").innerHTML = jsonData;}
		jsonData = JSON.parse(jsonData);
		viz.dispose();
		if(flowNum==0){setOrderDataVars(jsonData);}
		else if(flowNum==1){readOrdersFromOrderData(jsonData);}
		else if(flowNum==11){readShipperQty(jsonData);}
		else if(flowNum==12){readDataForLTFYes(jsonData);}
		else if(flowNum==13){readYoYLTFNo(jsonData);}
		else if(flowNum==211){readMTSOrder(jsonData);}
		else if(flowNum==212){readMTSDemand(jsonData);}
		else if(flowNum==221){readMTOOrder(jsonData);}
		else if(flowNum==222){readMTODemand(jsonData);}
		else if(flowNum==3){readOrderSummary(jsonData);}
		else if(flowNum==41){readFinalCallOffForSafetyStock(jsonData);}
		else if(flowNum==42){readDemandForSafetyStock(jsonData);}
    });
}

var order_no="", order_item_no="", year, week, sold_to="", sold_to_name="", ship_to="", ship_to_name="", material_no, sales_org="", long_term_flex,
short_term_flex, safety_stock, stated_lead_time, part_type, ww_number, ww_name, s_ship_week, s_dock_week, ltf_demand_qty, ltf_final_calloff, ltf_r_final_calloff, ltf_shipped_qty, ltf_shipper_qty, ltf_ship_week, ltf_dock_week,
logic1_dec, mts_mto_order_data,
mts_mto, rlt_week, p1_ll_week, p1_ul_week, p2_ll_week, p2_ul_week, p1_lower_per, p1_upper_per, p2_lower_per, p2_upper_per, ddp_no="", limit_snapshots=8,
logic1_f_str, logic2_f_str, safety_stock_f_str, order_no_str="", ship_to_str="", sold_to_str="", sales_org_str="", order_summary_str="", ddp_no_str="", selected_crw_weekdiff, ss_final_call_off, ss_rfinal_call_off, ss_shipped_qty, week_type="",
order_no_disp="", order_item_no_disp="", sales_org_disp="", ship_to_disp="", ship_to_name_disp="", sold_to_disp="", sold_to_name_disp="", ddp_no_disp="",
combo_details_pdf=[], contract_details_pdf=[], ltf_data_pdf=[], stf_data_pdf=[], order_summary_data_pdf=[], safety_stock_data_pdf=[], oth_pdf=[];

function setOptions(){
	var options;
	if(comboNo == 1){
		options = {
			"Order Number P":order_no,
			"Order Item Number P":order_item_no
		};
	}else if(comboNo == 2){
		options = {
			"Sold To Customer Number P":sold_to,
			"Material Number P":material_no
		};
	}else if(comboNo == 3){
		options = {
			"Ship To Customer Number P":ship_to,
			"Material Number P":material_no
		};
	}
	return options;
}

function calPerVariance(d_qty, f_call_off){
	var variance_per;
	if(d_qty==0){
		if(f_call_off == 0){variance_per = 0;}
		else if(f_call_off != 0){variance_per = 1;}
	}else{variance_per = (f_call_off/d_qty)-1;}
	return variance_per;
}

function initContractType(){
	order_no = document.getElementById("order no").value;
	order_item_no = document.getElementById("order item no").value;
	year = document.getElementById("year").value;
	week = document.getElementById("week").value;
	sold_to = document.getElementById("sold to no").value;
	ship_to = document.getElementById("ship to no").value;
	material_no = document.getElementById("material no").value;
	week_type = document.getElementById("week_type").value;
	
	var options= {
		"Year":year,
		"Week":week
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}	//populate new options to existing options
	if(week_type == "Ship"){
		options["Customer Request Ship Calendar Week"] = year + week;
	}else if(week_type == "Dock"){
		options["Customer Request Dock Calendar Week"] = year + week;
	}
	selectViz("vizContainer0", "Demand-Fields", options);
}

function setOrderDataVars(jsonData){
	var temp, temp1, temp2, i;
	var len_jsonData = jsonData.length;
	if(len_jsonData==0){
		long_term_flex="no";
		short_term_flex="no";
		safety_stock="no";
		part_type="Null";
		mts_mto="mto";
		swal("No Data!", "No data found for the current combination!");
		resetVariables();
		toggleElementAbility("buttonSubmit");
	}else{
		if(len_jsonData == 1){
			order_no = jsonData[0][0]["value"];
			order_no_disp = order_no;
			order_item_no = jsonData[0][15]["value"];
			order_item_no_disp = order_item_no;
			sold_to = jsonData[0][24]["value"];
			sold_to_disp = sold_to;
			sold_to_name = jsonData[0][25]["value"];
			sold_to_name_disp = sold_to_name;
			ship_to = jsonData[0][21]["value"];
			ship_to_disp = ship_to;
			ship_to_name = jsonData[0][22]["value"];
			ship_to_name_disp = ship_to_name;
			sales_org = jsonData[0][19]["value"];
			sales_org_disp = sales_org;
			ddp_no = jsonData[0][12]["value"];
			ddp_no_disp = ddp_no;
		}else{
			order_no = "";
			order_item_no = "";
			sold_to = "";
			sold_to_name = "";
			ship_to = "";
			ship_to_name = "";
			sales_org = "";
			ddp_no = "";
			for(i = 0; i < len_jsonData; i++){
				temp = jsonData[i][0]["value"];
				if(!order_no.includes(temp)){order_no += temp+",";order_item_no += jsonData[i][15]["value"]+",";}
				temp = jsonData[i][24]["value"];
				if(!sold_to.includes(temp)){sold_to += temp+",";sold_to_name += jsonData[i][25]["value"];+",";}
				temp = jsonData[i][21]["value"];
				if(!ship_to.includes(temp)){ship_to += temp+",";ship_to_name += jsonData[i][22]["value"]+",";}
				temp = jsonData[i][19]["value"];
				if(!sales_org.includes(temp)){sales_org += temp+",";}
				temp = jsonData[0][12]["value"];
				if(!ddp_no.includes(temp)){ddp_no += temp+",";}
			}
			if(order_no.slice(-1) == ","){order_no = order_no.slice(0,-1);}
			if(order_item_no.slice(-1) == ","){order_item_no = order_item_no.slice(0,-1);}
			if(sold_to.slice(-1) == ","){sold_to = sold_to.slice(0,-1);}
			if(sold_to_name.slice(-1) == ","){sold_to_name = sold_to_name.slice(0,-1);}
			if(ship_to.slice(-1) == ","){ship_to = ship_to.slice(0,-1);}
			if(ship_to_name.slice(-1) == ","){ship_to_name = ship_to_name.slice(0,-1);}
			if(sales_org.slice(-1) == ","){sales_org = sales_org.slice(0,-1);}
			if(ddp_no.slice(-1) == ","){ddp_no = ddp_no.slice(0,-1);}
			
			if(order_no.includes(",")){
				temp = order_no.split(",");
				temp1 = order_item_no.split(",");
				temp2 = temp.length;
				order_no_str = '<table><th>Order #</th><th>Order Item #</th>';
				for(i=0;i<temp2;i++){
					order_no_str += '<tr>';
					order_no_str += '<td>'+temp[i]+'</td><td>'+temp1[i]+'</td>';
					order_no_str += '</tr>';
				}
				order_no_str += '</table>';
				order_no_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(order_no_str)">Multiple Values</a>';
				order_item_no_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(order_no_str)">Multiple Values</a>';
			}else{
				order_no_str = order_no;
				order_no_disp = order_no;
				order_item_no_disp = order_item_no;
			}
			if(sold_to.includes(",")){
				temp = sold_to.split(",");
				temp1 = sold_to_name.split(",");
				temp2 = temp.length;
				sold_to_str = '<table><th>Sold To #</th><th>Sold To Name</th>';
				for(i=0;i<temp2;i++){
					sold_to_str += '<tr>';
					sold_to_str += '<td>'+temp[i]+'</td><td>'+temp1[i]+'</td>';
					sold_to_str += '</tr>';
				}
				sold_to_str += '</table>';
				sold_to_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(sold_to_str)">Multiple Values</a>';
				sold_to_name_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(sold_to_str)">Multiple Values</a>';
			}else{
				sold_to_str = sold_to;
				sold_to_disp = sold_to;
				sold_to_name_disp = sold_to_name;
			}
			if(ship_to.includes(",")){
				temp = ship_to.split(",");
				temp1 = ship_to_name.split(",");
				temp2 = temp.length;
				ship_to_str = '<table><th>Ship To #</th><th>Ship To Name</th>';
				for(i=0;i<temp2;i++){
					ship_to_str += '<tr>';
					ship_to_str += '<td>'+temp[i]+'</td><td>'+temp1[i]+'</td>';
					ship_to_str += '</tr>';
				}
				ship_to_str += '</table>';
				ship_to_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(ship_to_str)">Multiple Values</a>';
				ship_to_name_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(ship_to_str)">Multiple Values</a>';
			}else{
				ship_to_str = ship_to;
				ship_to_disp = ship_to;
				ship_to_name_disp = ship_to_name;
			}
			if(sales_org.includes(",")){
				temp = sales_org.split(",");
				temp1 = temp.length;
				sales_org_str = '<table><th>Sales Org</th>';
				for(i=0;i<temp1;i++){
					sales_org_str += '<tr>';
					sales_org_str += '<td>'+temp[i]+'</td>';
					sales_org_str += '</tr>';
				}
				sales_org_str += '</table>';
				sales_org_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(sales_org_str)">Multiple Values</a>';
			}else{
				sales_org_str = sales_org;
				sales_org_disp = sales_org;
			}
			if(ddp_no.includes(",")){
				temp = ddp_no.split(",");
				temp1 = temp.length;
				ddp_no_str = '<table><th>Default Delivery Plant</th>';
				for(i=0;i<temp1;i++){
					ddp_no_str += '<tr>';
					ddp_no_str += '<td>'+temp[i]+'</td>';
					ddp_no_str += '</tr>';
				}
				ddp_no_str += '</table>';
				ddp_no_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(ddp_no_str)">Multiple Values</a>';
			}else{
				ddp_no_str = ddp_no;
				ddp_no_disp = ddp_no;
			}
		}
		s_ship_week = jsonData[0][10]["value"];
		s_dock_week = jsonData[0][9]["value"];
		material_no = jsonData[0][14]["value"];
		ww_number = jsonData[0][28]["value"];
		temp = jsonData[0][27]["value"].split("(",1);
		ww_name = temp[0].trim();
		rlt_week = Math.ceil(parseInt(jsonData[0][17]["value"])/7);
		short_term_flex = jsonData[0][23]["value"];
		safety_stock = jsonData[0][18]["value"];
		long_term_flex = jsonData[0][13]["value"];
		stated_lead_time = jsonData[0][26]["value"];;
		part_type = jsonData[0][16]["value"];
		selected_crw_weekdiff = parseInt(jsonData[0][11]["value"]);
		week_type = document.getElementById("week_type").value;
		if(week_type == "Ship"){combo_details_pdf.push(["Customer Request Ship Calendar Week", ": "+s_ship_week]);}else if(week_type == "Dock"){combo_details_pdf.push(["Customer Request Dock Calendar Week", ": "+s_dock_week]);}
		if(week_type == "Dock"){
			year = s_ship_week.substring(0,4);
			week = s_ship_week.substring(4,6);
		}
		if((ddp_no.includes("0498") || ddp_no.includes("0115")) && ww_number == "0000000362"){	//hard coded logic for ddp, check documentation
			p1_ll_week = 0;
			p1_ul_week = 2;
			p2_ll_week = 3;
			p2_ul_week = 6;
		}else{
			p1_ll_week = parseInt(jsonData[0][2]["value"]);
			p1_ul_week = parseInt(jsonData[0][4]["value"]);
			p2_ll_week = parseInt(jsonData[0][6]["value"]);
			p2_ul_week = parseInt(jsonData[0][8]["value"]);
		}
		p1_lower_per = parseFloat(jsonData[0][1]["value"]);
		p1_upper_per = parseFloat(jsonData[0][3]["value"]);
		p2_lower_per = parseFloat(jsonData[0][5]["value"]);
		p2_upper_per = parseFloat(jsonData[0][7]["value"]);
		
		if(long_term_flex=="yes"){
			// document.getElementById("ltf_est").src = "./images/yes.png";
			fillData("ltf_status", "yes", " Established");
			contract_details_pdf[0] = ["Long Term Forecast", ": Established"];
		}else if(long_term_flex=="no" || long_term_flex == "%null%"){
			// document.getElementById("ltf_not_est").src = "./images/no.png";
			fillData("ltf_status", "no", " Not Established");
			contract_details_pdf[0] = ["Long Term Forecast", ": Not Established"];
		}
		
		if(short_term_flex == "yes" && part_type == "Make to Stock"){
			document.getElementById("contract_type").innerHTML = "Short Term Flex";
			// document.getElementById("stf_est").src = "./images/yes.png";
			fillData("stf_status", "yes", " Established");
			
			// document.getElementById("mts_period_check").src = "./images/yes.png";
			fillData("period_status", "yes", " Flex/Frozen Zone");

			// document.getElementById("mts_check").src = "./images/yes.png";
			fillData("mts_status", "yes", " Make To Stock");

			mts_mto = "mts";
			contract_details_pdf[1] = ["Short Term Forecast", ": Established"];
			contract_details_pdf[3] = ["Part Type", ": Make to Stock"];
		}else if(short_term_flex == "yes" && part_type == "Make to Order"){
			document.getElementById("contract_type").innerHTML = "Short Term Flex";
			// document.getElementById("stf_est").src = "./images/yes.png";
			fillData("stf_status", "yes", " Not Established");

			// document.getElementById("mto_period_check").src = "./images/yes.png";
			fillData("period_status", "yes", " Replenishment Lead Time");

			// document.getElementById("mto_check").src = "./images/yes.png";
			fillData("mts_status", "yes", " Make To Order");

			mts_mto = "mto";
			contract_details_pdf[1] = ["Short Term Forecast", ": Established"];
			contract_details_pdf[3] = ["Part Type", ": Make to Order"];
		}else if((short_term_flex == "no" || short_term_flex == "%null%") && part_type == "Make to Stock" && safety_stock == "yes"){
			document.getElementById("contract_type").innerHTML = "ADC";
			document.getElementById("stf_not_est").src = "./images/no.png";
			fillData("stf_status", "no", " Not Established");

			// document.getElementById("mts_check").src = "./images/yes.png";
			fillData("mts_status", "yes", " Make To Order");

			rlt_week = parseInt(stated_lead_time);
			mts_mto = "mto";
			contract_details_pdf[1] = ["Short Term Forecast", ": Not Established"];
			contract_details_pdf[3] = ["Part Type", ": Make to Order"];
		}else if((short_term_flex == "no" || short_term_flex == "%null%") && part_type == "Make to Order" && safety_stock == "yes"){
			document.getElementById("contract_type").innerHTML = "ADC";
			document.getElementById("stf_not_est").src = "./images/no.png";
			fillData("stf_status", "no", " Not Established");

			// document.getElementById("mto_check").src = "./images/yes.png";
			fillData("mts_status", "yes", " Make To Order");

			// document.getElementById("mto_period_check").src = "./images/yes.png";
			fillData("period_status", "yes", " Replenishment Lead Time");

			mts_mto = "mto";
			contract_details_pdf[1] = ["Short Term Forecast", ": Not Established"];
			contract_details_pdf[3] = ["Part Type", ": Make to Order"];
		}else{
			document.getElementById("stf_not_est").src = "./images/no.png";
			fillData("stf_status", "no", " Not Established");

			// document.getElementById("mto_period_check").src = "./images/yes.png";
			fillData("period_status", "yes", " Replenishment Lead Time");

			mts_mto = 'mto';
			contract_details_pdf[1] = ["Short Term Forecast", ": Not Established"];
			contract_details_pdf[3] = ["Part Type", ": Make to Order"];
		}
		//write data to page
		// $(".spinCon").removeClass("spinner");
		document.getElementById("Ord_num_p").innerHTML = order_no_disp;
		document.getElementById("Ship_to_num_p").innerHTML = ship_to_disp;
		document.getElementById("Ship_to_name_p").innerHTML = ship_to_name_disp;
		document.getElementById("Sales_org_p").innerHTML = sales_org_disp;
		document.getElementById("wwnum_p").innerHTML = ww_number;
		document.getElementById("order_item_num_p").innerHTML = order_item_no_disp;
		document.getElementById("sold_to_num_p").innerHTML = sold_to_disp;
		document.getElementById("sold_to_name_p").innerHTML = sold_to_name_disp;
		document.getElementById("mat_num_p").innerHTML = material_no;
		document.getElementById("wwname_p").innerHTML = ww_name;
		document.getElementById("ddp_no_p").innerHTML = ddp_no_disp;
		swal("Order Details Obtained!");
		if(safety_stock == "yes"){
			// document.getElementById("ss_est").src = "./images/yes.png";
			fillData("ss_status", "yes", " Established");
			
			contract_details_pdf[2] = ["Safety Stock", ": Established"];
		}else if(safety_stock == "no" || safety_stock == "%null%"){
			// document.getElementById("ss_not_est").src = "./images/no.png";
			fillData("ss_status", "no", " Not Established");

			contract_details_pdf[2] = ["Safety Stock", ": Not Established"];
		}
		if((short_term_flex=="no" || short_term_flex=="%null%") && (long_term_flex=="no" || long_term_flex=="%null%") && (safety_stock=="no" || safety_stock=="%null%")){
			document.getElementById("contract_type").innerHTML = "Contract not in place";
			mts_mto="contract not in place";
			contract_details_pdf[3] = ["Part Type", ": Contract not in place"];
		}
		getOrdersFromOrderData();
	}
}

function getOrdersFromOrderData(){
	flowNum=1;
	var options= {
		"Year":year,
		"Week":week
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week Number"] = year + week;
	selectViz("vizContainer1", "Orders-Order", options);
}

function readOrdersFromOrderData(jsonData){
	try{
	var len_jsonData = jsonData.length, i, temp;
	for(i = 0; i < len_jsonData; i++){
		if(!order_no.includes(jsonData[i][2]["value"])){
			if(order_no_disp.includes("Multiple Values")){
				temp = order_no_str.split("</table>");
				order_no_str = temp[0] + "<tr><td>" + jsonData[i][2]["value"] + "</td><td>" + jsonData[i][1]["value"] + "</td></tr></table>";
			}else{
				order_no_str = "<table><tr><th>Order #</th><th>Order Item #</th></tr><tr><td>" + order_no + "</td><td>" + order_item_no + "</td></tr><tr><td>" + jsonData[i][2]["value"] + "</td><td>" + jsonData[i][1]["value"] + "</td></tr></table>";
				order_no_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(order_no_str)">Multiple Values</a>';
				order_item_no_disp =  order_no_disp;
			}
			order_no = order_no + "," + jsonData[i][2]["value"];
			if(!order_item_no.includes(jsonData[i][1]["value"])){
				order_item_no = order_item_no + "," + jsonData[i][1]["value"];
			}
		}
		if(!sales_org.includes(jsonData[i][3]["value"])){
			if(sales_org_disp.includes("Multiple Values")){
				temp = sales_org_str.split("</table>");
				sales_org_str = temp[0] + "<tr><td>" + jsonData[i][3]["value"] + "</td></tr></table>";
			}else{
				sales_org_str = "<table><tr><th>Sales Org</th></tr><tr><td>" + sales_org + "</td></tr><tr><td>" + jsonData[i][3]["value"] + "</td></tr></table>";
				sales_org_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(sales_org_str)">Multiple Values</a>';
			}
			sales_org = sales_org + "," + jsonData[i][3]["value"];
		}
		if(!sold_to.includes(jsonData[i][6]["value"])){
			if(sold_to_disp.includes("Multiple Values")){
				temp = sold_to_str.split("</table>");
				sold_to_str = temp[0] + "<tr><td>" + jsonData[i][6]["value"] + "</td><td>" + jsonData[i][7]["value"] + "</td></tr></table>";
			}else{
				sold_to_str = "<table><tr><th>Sold To #</th><th>Sold To Name</th></tr><tr><td>" + sold_to + "</td><td>" + sold_to_name + "</td></tr><tr><td>" + jsonData[i][6]["value"] + "</td><td>" + jsonData[i][7]["value"] + "</td></tr></table>";
				sold_to_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(sold_to_str)">Multiple Values</a>';
				sold_to_name_disp =  sold_to_disp;
			}
			sold_to = sold_to + "," + jsonData[i][6]["value"];
		}
		if(!ship_to.includes(jsonData[i][4]["value"])){
			if(ship_to_disp.includes("Multiple Values")){
				temp = ship_to_str.split("</table>");
				ship_to_str = temp[0] + "<tr><td>" + jsonData[i][4]["value"] + "</td><td>" + jsonData[i][5]["value"] + "</td></tr></table>";
			}else{
				ship_to_str = "<table><tr><th>Ship To #</th><th>Ship To Name</th></tr><tr><td>" + ship_to + "</td><td>" + ship_to_name + "</td></tr><tr><td>" + jsonData[i][4]["value"] + "</td><td>" + jsonData[i][5]["value"] + "</td></tr></table>";
				ship_to_disp =  '<a href="javascript:void(0)" onclick="openDataOverlay(ship_to_str)">Multiple Values</a>';
				ship_to_name_disp =  ship_to_disp;
			}
			ship_to = ship_to + "," + jsonData[i][4]["value"];
		}
	}
	document.getElementById("Ord_num_p").innerHTML = order_no_disp;
	document.getElementById("order_item_num_p").innerHTML = order_item_no_disp;
	document.getElementById("Ship_to_num_p").innerHTML = ship_to_disp;
	document.getElementById("Ship_to_name_p").innerHTML = ship_to_name_disp;
	document.getElementById("Sales_org_p").innerHTML = sales_org_disp;
	document.getElementById("sold_to_num_p").innerHTML = sold_to_disp;
	document.getElementById("sold_to_name_p").innerHTML = sold_to_name_disp;
	combo_details_pdf.push(["Order #", ": "+order_no]);
	combo_details_pdf.push(["Order Item #", ": "+order_item_no]);
	combo_details_pdf.push(["Ship To #", ": "+ship_to]);
	combo_details_pdf.push(["Ship To Name", ": "+ship_to_name]);
	combo_details_pdf.push(["Sold To #", ": "+sold_to]);
	combo_details_pdf.push(["Sold To Name", ": "+sold_to_name]);
	combo_details_pdf.push(["Sales Org", ": "+sales_org]);
	combo_details_pdf.push(["World Wide #", ": "+ww_number]);
	combo_details_pdf.push(["World Wide Name", ": "+ww_name]);
	combo_details_pdf.push(["Material #", ": "+material_no]);
	if(long_term_flex=="yes"){
		getShipperQty();
	}else if(long_term_flex=="no" || long_term_flex == "%null%"){
		initYoYLTFNo();
	}
	}catch(e){
		console.log(e);
		alert("something went wrong");
	}
}

function getShipperQty(){
	flowNum=11;
	var options={
		"Year":year,
		"Week":week,
		"Worldwide Number":ww_number,
		"Material Number":material_no
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week Number"] = year + week;
	selectViz("vizContainer2", "LTFShipperQty", options);
}

function readShipperQty(jsonData){
	var len_jsonData = jsonData.length;
	if(len_jsonData == 0){
		ltf_shipper_qty = "0";
	}else if(len_jsonData == 1){
		ltf_shipper_qty = jsonData[0][1]["value"];
	}else{
		ltf_shipper_qty = jsonData[0][len_jsonData-1]["value"];
		alert("multiple schedule lines for Shipper Qty!");
	}
	getDataForLTFYes();
}

function getDataForLTFYes(){
	flowNum=12;
	var options={
		"Year":year,
		"Week":week,
		"Worldwide Number":ww_number,
		"Material Number":material_no
	};
	selectViz("vizContainer2", "LTF-FinalCalloffandDemandQty", options);
}

function readDataForLTFYes(jsonData){
	// try{
	var len_jsonData = jsonData.length;
	var result_status, result_val, i, p_dock_week, c_dock_week;
	if(len_jsonData==0){
		result_status="No data for Long Term Flex";resetContent();toggleElementAbility("buttonSubmit");
	}else if(len_jsonData==1){
		result_status = "success";
		ltf_ship_week = jsonData[0][1]["value"];
		ltf_dock_week = jsonData[0][0]["value"];
		ltf_demand_qty = jsonData[0][7]["value"];
		ltf_final_calloff = jsonData[0][8]["value"];
		ltf_r_final_calloff = jsonData[0][5]["value"];
		ltf_shipped_qty = jsonData[0][6]["value"];
		finalDecLTFYes();
	}else if(len_jsonData>1){
		result_status = "success";
		for(i=0;i<len_jsonData;i++){
			if(i==0){
				c_dock_week = parseInt(jsonData[i][0]["value"]);
				p_dock_week = c_dock_week;
				ltf_ship_week = jsonData[i][1]["value"];
				ltf_dock_week = jsonData[i][0]["value"];
				ltf_demand_qty = jsonData[i][7]["value"];
				ltf_shipped_qty = jsonData[i][6]["value"];
				ltf_final_calloff = parseFloat(jsonData[i][8]["value"]);
				ltf_r_final_calloff = parseFloat(jsonData[i][5]["value"]);
			}else{
				c_dock_week = parseInt(jsonData[i][0]["value"]);
				ltf_final_calloff += parseFloat(jsonData[i][8]["value"]);
				ltf_r_final_calloff += parseFloat(jsonData[i][5]["value"]);
			}
			if(c_dock_week > p_dock_week){
				ltf_dock_week = jsonData[i][0]["value"];
				ltf_demand_qty = jsonData[i][7]["value"];
				ltf_shipped_qty = jsonData[i][6]["value"];
			}
			p_dock_week = parseInt(jsonData[i][0]["value"]);
		}
		finalDecLTFYes();
	}
	if(result_status != "success"){alert(result_status);}
	// }catch(e){
		// console.log(e);
		// alert("Something went wrong with LTF!");
	// }
}

function finalDecLTFYes(){
	var demand, finalCalloff, rfinalCalloff, variance_per, rvariance_per, shipper_qty, round_up_ratio, round_up_qty, final_dec, per_ll, per_ul;
	demand = Math.round(parseFloat(ltf_demand_qty));
	finalCalloff = ltf_final_calloff;
	rfinalCalloff = ltf_r_final_calloff;
	if(ltf_shipper_qty == "%null%"){
		shipper_qty = 0;
	}else{
		shipper_qty = Math.round(parseFloat(ltf_shipper_qty));
	}
	
	if(shipper_qty == 0){
		round_up_ratio = 0;
	}else{
		round_up_ratio = Math.round(demand/shipper_qty);
	}
	if(round_up_ratio == 0){
		round_up_qty = Math.round(demand);
	}else{
		round_up_qty = Math.round(shipper_qty*round_up_ratio);
	}
	
	if(round_up_qty==0){
		if(finalCalloff==0){variance_per=0;}else if(finalCalloff!=0){variance_per=1;}
		if(rfinalCalloff==0){rvariance_per=0;}else if(rfinalCalloff!=0){rvariance_per=1;}
	}else{
		variance_per = (finalCalloff/round_up_qty)-1;
		rvariance_per = (rfinalCalloff/round_up_qty)-1;
	}
	variance_per = variance_per.toFixed(2);
	rvariance_per = rvariance_per.toFixed(2);
	if(ww_number == "0000000362" || ww_number == "0000000179"){
		per_ll = 0;
		per_ul = 0.15;
	}else if(ww_number == "0000000899"){
		per_ll = 0;
		per_ul = 0;
	}else{
		per_ll = 0;
		per_ul = 0;
	}
	if(rvariance_per <= per_ul && rvariance_per >= per_ll){
		final_dec = "Not Deviated";
	}else{
		final_dec = "Deviated";
	}
	logic1_f_str = '<table><tr><th>Ship Week</th><th>Dock Week</th><th>Shipped Quantity</th><th>APQ</th><th>Round Up Quantity</th><th>Final CallOff</th><th>Committed Quantity</th><th>% Variance</th><th>Review Week Final CallOff</th><th>% Review Week Variance</th></tr><tr><td>'+ltf_ship_week+'</td><td>'+ltf_dock_week+'</td><td>'+ltf_shipped_qty+'</td><td>'+ltf_shipper_qty+'</td><td>'+round_up_qty.toLocaleString('en')+'</td><td>'+(Math.round(finalCalloff)).toLocaleString('en')+'</td><td>'+(Math.round(demand)).toLocaleString('en')+'</td><td>'+(Math.round(variance_per*100)).toString()+'%';
	ltf_data_pdf.push(["Ship Week","Dock Week","Shipped Quantity","APQ","Round Up Quantity","Final CallOff","Committed Quantity","% Variance","Review Week Final CallOff","% Review Week Variance"]);
	ltf_data_pdf.push([[ltf_ship_week, ltf_dock_week, ltf_shipped_qty, ltf_shipper_qty, round_up_qty.toLocaleString('en'), (Math.round(finalCalloff)).toLocaleString('en'), (Math.round(demand)).toLocaleString('en'), (Math.round(variance_per*100)).toString()+'%', (Math.round(rfinalCalloff)).toLocaleString('en'), (Math.round(rvariance_per*100)).toString()+'%']]);
	if(variance_per < 0){
		logic1_f_str += '&nbsp;&nbsp;<img src="Images/arrow-down.jpg" class="img_arrow" />';
	}else if(variance_per > 0){
		logic1_f_str += '&nbsp;&nbsp;<img src="Images/arrow-up.jpg" class="img_arrow" />';
	}
	logic1_f_str +='</td><td>' + (Math.round(rfinalCalloff)).toLocaleString('en') +'</td><td>' + (Math.round(rvariance_per*100)).toString() + ' %</td></tr></table>';
	variance_per = (rvariance_per*100).toFixed(2)+"%";
	finalLogicOne(variance_per,final_dec);
}

function initYoYLTFNo(){
	flowNum=13;
	var options= {
		"Year":year,
		"Week":week
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	selectViz("vizContainer2", "YoY", options);
}

function readYoYLTFNo(jsonData){
	var i, CY_val=0, PY_val=0, variance_per, final_dec, t_week = parseInt(week), temp, temp_pdf=[], per_ll, per_ul;
	var len_jData = jsonData.length;
	logic1_f_str = '<table><tr><th>Week</th><th>'+year+'</th><th>'+(parseInt(year)-1).toString()+'</th></tr>';
	ltf_data_pdf.push(["Week", year, (parseInt(year)-1).toString()]);
	if(len_jData == 0){
		for(i=13;i>=1;i--){
			temp = t_week - i;
			if(temp <= 0){temp = 52 + temp;}
			logic1_f_str += '<tr><td>Week '+temp.toString()+'</td><td>0</td><td>0</td></tr>';
			temp_pdf.push([temp.toString(),0,0]);
		}
	}else{
		for(i=0;i<len_jData;i++){
			logic1_f_str += '<tr><td>'+jsonData[i][0]["value"]+'</td><td>'+Math.round(parseFloat(jsonData[i][1]["value"])).toLocaleString('en')+'</td><td>'+Math.round(parseFloat(jsonData[i][2]["value"])).toLocaleString('en')+'</td></tr>';
			CY_val += parseInt(jsonData[i][1]["value"]);
			PY_val += parseInt(jsonData[i][2]["value"]);
			temp_pdf.push([jsonData[i][0]["value"], Math.round(parseFloat(jsonData[i][1]["value"])).toLocaleString('en'), Math.round(parseFloat(jsonData[i][2]["value"])).toLocaleString('en')]);
		}
	}
	ltf_data_pdf.push(temp_pdf);
	if(PY_val == 0){
		if(CY_val == 0){variance_per = 0;}else{variance_per = 1;}
	}else{variance_per = (CY_val/PY_val)-1;}
	logic1_f_str += '<tr><td><b>Total</b></td><td>'+Math.round(CY_val).toLocaleString('en')+'</td><td>'+Math.round(PY_val).toLocaleString('en')+'</td></tr></table><span><b>% Variance : '+(Math.round(variance_per*100)).toString()+' %</b>';
	if(variance_per < 0){
		logic1_f_str += '&nbsp;&nbsp;<img src="Images/arrow-down.jpg" class="img_arrow" />';
	}else if(variance_per > 0){
		logic1_f_str += '&nbsp;&nbsp;<img src="Images/arrow-up.jpg" class="img_arrow" />';
	}
	logic1_f_str +='</span>';
	if(ww_number == "0000000362" || ww_number == "0000000179"){
		per_ll = 0;
		per_ul = 0.15;
	}else if(ww_number == "0000000899"){
		per_ll = 0;
		per_ul = 0;
	}else{
		per_ll = 0;
		per_ul = 0;
	}
	if(variance_per <= per_ul && variance_per >= per_ll){
		final_dec = "Not Deviated";
	}else{
		final_dec = "Deviated";
	}
	variance_per = (Math.round(variance_per*100)).toString()+"%";
	oth_pdf[0] = "% Variance :" + variance_per;
	finalLogicOne(variance_per,final_dec);
}

function finalLogicOne(variance_per,final_dec){
	var ele_handle, temp;
	if(final_dec=="Deviated"){
		// document.getElementById("logic1_dvt").src = "./images/no.png";
		fillData("dvt1_status", "no", " Deviated");

		contract_details_pdf[4] = ["Long Term Forecast", ": Customer Deviated"];
	}else if(final_dec=="Not Deviated"){
		// document.getElementById("logic1_not_dvt").src = "./images/yes.png";
		fillData("dvt1_status", "yes", " Not Deviated");

		contract_details_pdf[4] = ["Long Term Forecast", ": Customer Not Deviated"];
	}
	ele_handle = document.getElementById("logic1_button");
	temp = ele_handle.className;
	ele_handle.className = temp + " glowbutton";
	ele_handle.onclick = function() {openDataOverlay(logic1_f_str);};
	//document.getElementById("logic1_variance_per").innerHTML = variance_per;
	logic1_dec = final_dec;
	swal("Long Term Forecast details obtained!");
	if(mts_mto == "mts"){initMTS();}
	else if(mts_mto == "mto" || mts_mto == "contract not in place"){initMTO();}			
}

function initMTS(){
	flowNum=211;
	var options={
		"Period 1 LL Week": p1_ll_week,
		"Period 2 UL Week": p2_ul_week,
		"Year": year,
		"Week": week,
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week Number"] = year + week;
	selectViz("vizContainer3", "MTS-FinalCallOff", options);
}

function readMTSOrder(jsonData){
	mts_mto_order_data = jsonData;
	getMTSDemand();
}

function getMTSDemand(){
	flowNum=212;
	var options={
		"Period 1 LL Week": p1_ll_week,
		"Period 2 UL Week": p2_ul_week,
		"Year": year,
		"Week": week,
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week"] = year + week;
	selectViz("vizContainer4", "MTS-Demand", options);
}

function readMTSDemand(jsonData){
	try{
	var len_jsonData = jsonData.length, len_agg_data,
	len_order_jsonData = mts_mto_order_data.length,
	i, j, mts_data=[[],[],[],[],[],[],[],[],[],[],[],[],[]], mts_agg_data=[[],[],[],[],[],[],[]], flag_order_array=[], row_count = 0, snapshot_week, variance_per, rvariance_per, weekly_dec, final_dec = "Not Deviated", demand_qty = 0, final_call_off = 0, rfinal_call_off = 0, week_diff, i_doc, period_str,
	s_year = parseInt(year), s_week = parseInt(week), start_year, start_week, d_year, d_week, c_sw, p_sw, p_order_no, temp, n_snapshot_week, n_start_week,
	d_order_no, o_order_no, d_order_item, o_order_item, d_ship_date, o_ship_date, agg_final_call_off=0, agg_rfinal_call_off=0;
	//populate flag_order_array with default 'Yes', number equal to number of records retrieved in order request
	for(i=0;i<len_order_jsonData;i++){
		flag_order_array.push("Yes");
		agg_final_call_off += parseInt(mts_mto_order_data[i][5]["value"]);
		agg_rfinal_call_off += parseInt(mts_mto_order_data[i][6]["value"]);
	}

	if(s_week-p2_ul_week <= 0){
		start_year = s_year-1;
		start_week = 52-Math.abs(s_week-p2_ul_week);
	}else{
		start_year = s_year;
		start_week = s_week-p2_ul_week;
	}
	
	temp = start_week.toString();
	if(temp.length == 1){temp = "0" + temp;}
	p_sw = start_year.toString() + temp;
	
	if(len_jsonData == 0){
		d_year = s_year; d_week = s_week;
		n_start_week = parseInt(concoctYearWeek(start_year, start_week));
		while(n_snapshot_week > n_start_week){
			for(i=0;i<len_order_jsonData;i++){
				temp = start_week.toString();
				if(temp.length == 1){temp = "0" + temp;}
				c_sw = start_year.toString() + temp;
				p_sw = c_sw;
				mts_data[0].push("*" + c_sw);	//snapshot calendar week
				mts_data[1].push("Line does not exist");	//schedule line
				mts_data[4].push("Line does not exist");	//delivery schedule date
				mts_data[7].push("Line does not exist");	//idoc
				mts_data[8].push("0");	//shipped qty
				mts_data[9].push("0");	//demand qty
				mts_data[12].push("Line does not exist");	//default delivery plant
				if(len_order_jsonData >0){	//check if order data is available
					mts_data[2].push(mts_mto_order_data[i][4]["value"]);	//order number
					mts_data[3].push(mts_mto_order_data[i][3]["value"]);	//order item
					mts_data[5].push(mts_mto_order_data[i][0]["value"]);	//ship date
					mts_data[6].push(mts_mto_order_data[i][1]["value"]);	//dock date
					mts_data[10].push(mts_mto_order_data[i][5]["value"]);	//final call off
					mts_data[11].push(mts_mto_order_data[i][6]["value"]);	//review week final call off
				}else{	//if no order data available
					mts_data[2].push("Line does not exist");	//order number
					mts_data[3].push("Line does not exist");	//order item
					mts_data[5].push("Line does not exist");	//ship date
					mts_data[6].push("Line does not exist");	//dock date
					mts_data[10].push("0");	//final call off
					mts_data[11].push("0");	//review week final call off
				}
			}
			if(len_order_jsonData > 0){
				mts_agg_data[0].push(len_order_jsonData);	//row_count
				mts_agg_data[1].push(0);	//agg demand qty
				mts_agg_data[2].push(agg_final_call_off);	//agg final call off
				mts_agg_data[3].push(calPerVariance(0,agg_final_call_off));	//% variance
				mts_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
				mts_agg_data[5].push(calPerVariance(0,agg_rfinal_call_off));	//% review week variance
				if(p2_lower_per == -1){mts_agg_data[6].push("Not Deviated");}	//weekly decision
				else{
					mts_agg_data[6].push("Deviated");
					final_dec = "Deviated";
				}
			}else{
				mts_agg_data[0].push(1);	//row_count
				mts_agg_data[1].push(0);	//agg demand qty
				mts_agg_data[2].push(0);	//agg final call off
				mts_agg_data[3].push(0);	//% variance
				mts_agg_data[4].push(0);	//agg review week final call off
				mts_agg_data[5].push(0);	//% review week variance
				if(p2_lower_per == -1){mts_agg_data[6].push("Not Deviated");}	//weekly decision
				else{
					mts_agg_data[6].push("Deviated");
					final_dec = "Deviated";
				}
			}
			if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
			n_start_week = parseInt(concoctYearWeek(start_year, start_week));
		}
	}else{
		for(i=0;i<len_jsonData;i++){
			snapshot_week = jsonData[i][10]["value"]; //moved here to make sure that the condition to compare previous and current snapshots
			if(i==0){p_sw = snapshot_week;}	//init p_sw with first snapshot_week
			if(snapshot_week != p_sw){	//check and create data for demand if order data is available
				if(flag_order_array.includes("Yes")){
					for(j=0;j<len_order_jsonData;j++){
						if(flag_order_array[j] == "Yes"){
							mts_data[0].push("*"+p_sw);	//snapshot calendar week
							mts_data[1].push("Line does not exist");	//schedule line
							mts_data[2].push(mts_mto_order_data[j][4]["value"]);	//order number
							mts_data[3].push(mts_mto_order_data[j][3]["value"]);	//order item
							mts_data[4].push("Line does not exist");	//delivery schedule date
							mts_data[5].push(mts_mto_order_data[j][0]["value"]);	//ship date
							mts_data[6].push(mts_mto_order_data[j][1]["value"]);	//dock date
							mts_data[7].push("Line does not exist");	//idoc
							mts_data[8].push("0");	//shipped qty
							mts_data[12].push("Line does not exist");	//default delivery plant
							mts_data[9].push("0");	//demand qty
							mts_data[10].push(mts_mto_order_data[j][5]["value"]);	//final call off
							mts_data[11].push(mts_mto_order_data[j][6]["value"]);	//review week final call off
							mts_agg_data[0][mts_agg_data[0].length-1] += 1; 
						}
						flag_order_array[j] = "Yes";	//reset flag_order_array values
					}
				}
			}else{
				
			}
			
			n_start_week = parseInt(concoctYearWeek(start_year, start_week));
			len_agg_data = mts_agg_data[0].length;
			n_snapshot_week = parseInt(snapshot_week);
			d_year = parseInt(snapshot_week.substring(0,4));
			d_week = parseInt(snapshot_week.substring(4,6));
			week_diff = parseInt(jsonData[i][8]["value"]);
			demand_qty = jsonData[i][13]["value"];
			d_order_no = jsonData[i][0]["value"];
			d_order_item = jsonData[i][7]["value"];
			d_ship_date = jsonData[i][3]["value"];
			
			if(demand_qty == "%null%"){demand_qty = 0;}else{demand_qty = parseFloat(demand_qty);}
			
			for(j=0;j<len_order_jsonData;j++){
				o_order_no = mts_mto_order_data[j][4]["value"];
				o_order_item = mts_mto_order_data[j][3]["value"];
				o_ship_date = mts_mto_order_data[j][0]["value"];
				if(d_order_no == o_order_no && d_order_item == o_order_item && d_ship_date == o_ship_date){// blend check between demand and order for fields order no, order item no and ship date
					flag_order_array[j] = "No";
					final_call_off = mts_mto_order_data[j][5]["value"];
					rfinal_call_off = mts_mto_order_data[j][6]["value"];
					break;
				}else{
					final_call_off = 0;
					rfinal_call_off = 0;
				}
			}
			
			if(final_call_off == "%null%"){final_call_off = 0;}else{final_call_off = parseFloat(final_call_off);}
			if(rfinal_call_off == "%null%"){rfinal_call_off = 0;}else{rfinal_call_off = parseFloat(rfinal_call_off);}
			
			while(n_snapshot_week > n_start_week){
				for(j=0;j<len_order_jsonData;j++){
					temp = start_week.toString();
					if(temp.length == 1){temp = "0" + temp;}
					c_sw = start_year.toString() + temp;
					p_sw = c_sw;
					mts_data[0].push("*" + c_sw);	//snapshot calendar week
					mts_data[1].push("Line does not exist");	//schedule line
					mts_data[4].push("Line does not exist");	//delivery schedule date
					mts_data[7].push("Line does not exist");	//idoc
					mts_data[8].push("0");	//shipped qty
					mts_data[9].push("0");	//demand qty
					mts_data[12].push("Line does not exist");	//default delivery plant
					if(len_order_jsonData >0){	//check if order data is available
						mts_data[2].push(mts_mto_order_data[j][4]["value"]);	//order number
						mts_data[3].push(mts_mto_order_data[j][3]["value"]);	//order item
						mts_data[5].push(mts_mto_order_data[j][0]["value"]);	//ship date
						mts_data[6].push(mts_mto_order_data[j][1]["value"]);	//dock date
						mts_data[10].push(mts_mto_order_data[j][5]["value"]);	//final call off
						mts_data[11].push(mts_mto_order_data[j][6]["value"]);	//review week final call off
					}else{	//if no order data available
						mts_data[2].push("Line does not exist");	//order number
						mts_data[3].push("Line does not exist");	//order item
						mts_data[5].push("Line does not exist");	//ship date
						mts_data[6].push("Line does not exist");	//dock date
						mts_data[10].push("0");	//final call off
						mts_data[11].push("0");	//review week final call off
					}
				}
				if(len_order_jsonData > 0){
					mts_agg_data[0].push(len_order_jsonData);	//row_count
					mts_agg_data[1].push(0);	//agg demand qty
					mts_agg_data[2].push(agg_final_call_off);	//agg final call off
					mts_agg_data[3].push(calPerVariance(0,agg_final_call_off));	//% variance
					mts_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
					mts_agg_data[5].push(calPerVariance(0,agg_rfinal_call_off));	//% review week variance
					if(p2_lower_per == -1){mts_agg_data[6].push("Not Deviated");}	//weekly decision
					else{
						mts_agg_data[6].push("Deviated");
						final_dec = "Deviated";
					}
				}else{
					mts_agg_data[0].push(1);	//row_count
					mts_agg_data[1].push(0);	//agg demand qty
					mts_agg_data[2].push(0);	//agg final call off
					mts_agg_data[3].push(0);	//% variance
					mts_agg_data[4].push(0);	//agg review week final call off
					mts_agg_data[5].push(0);	//% review week variance
					if(p2_lower_per == -1){mts_agg_data[6].push("Not Deviated");}	//weekly decision
					else{
						mts_agg_data[6].push("Deviated");
						final_dec = "Deviated";
					}
				}
				if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
				n_start_week = parseInt(concoctYearWeek(start_year, start_week));
			}
			
			if(year == snapshot_week.substring(0,4) && week == snapshot_week.substring(4,6)){break;}
			
			if(snapshot_week == p_sw && len_agg_data != 0){
				temp = len_agg_data-1;
				mts_agg_data[0][temp] += 1; //row count
				mts_agg_data[1][temp] += demand_qty; //agg demand qty
				// if(jsonData[i][0]["value"] == p_order_no){	//if same order no. in same snapshot week, dont sum up final call off
					// //do nothing or dont sum
				// }else{
					// mts_agg_data[2][temp] += final_call_off; //agg final call off
					// mts_agg_data[4][temp] += rfinal_call_off; //agg review week final call off
				// }
				variance_per = calPerVariance(mts_agg_data[1][temp], agg_final_call_off);
				rvariance_per = calPerVariance(mts_agg_data[1][temp], agg_rfinal_call_off);
				mts_agg_data[3][temp] = variance_per.toFixed(2); //% variance
				mts_agg_data[5][temp] = rvariance_per.toFixed(2); //% review week variance
				if(p1_ll_week<=week_diff && week_diff<=p1_ul_week){	//Decision
					if(p1_lower_per<=rvariance_per && rvariance_per<=p1_upper_per){weekly_dec = "Not Deviated";}else{weekly_dec = "Deviated";}
				}else if(p2_ll_week<=week_diff && week_diff<=p2_ul_week){
					if(p2_lower_per<=rvariance_per && rvariance_per<=p2_upper_per){weekly_dec = "Not Deviated";}else{weekly_dec = "Deviated";}
				}
				mts_agg_data[6][temp] = weekly_dec;	//weekly decision
			}else{
				mts_agg_data[0].push(1);	//row_count
				mts_agg_data[1].push(demand_qty);	//agg demand qty
				mts_agg_data[2].push(agg_final_call_off);	//agg final call off
				variance_per = calPerVariance(demand_qty, agg_final_call_off);
				mts_agg_data[3].push(variance_per.toFixed(2));	//% variance
				mts_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
				rvariance_per = calPerVariance(demand_qty, agg_rfinal_call_off);
				mts_agg_data[5].push(rvariance_per.toFixed(2));	//% review week variance
				if(p1_ll_week<=week_diff && week_diff<=p1_ul_week){	//Decision
					if(p1_lower_per<=rvariance_per && rvariance_per<=p1_upper_per){weekly_dec = "Not Deviated";}else{weekly_dec = "Deviated";}
				}else if(p2_ll_week<=week_diff && week_diff<=p2_ul_week){
					if(p2_lower_per<=rvariance_per && rvariance_per<=p2_upper_per){weekly_dec = "Not Deviated";}else{weekly_dec = "Deviated";}
				}
				mts_agg_data[6].push(weekly_dec);	//weekly decision
				if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
			}
			
			mts_data[0].push(snapshot_week);	//snapshot calendar week
			mts_data[1].push(jsonData[i][9]["value"]);	//schedule line
			mts_data[2].push(jsonData[i][0]["value"]);	//order number
			mts_data[3].push(jsonData[i][7]["value"]);	//order item
			mts_data[4].push(jsonData[i][5]["value"]);	//delivery schedule date
			mts_data[5].push(jsonData[i][3]["value"]);	//ship date
			mts_data[6].push(jsonData[i][1]["value"]);	//dock date
			mts_data[7].push(jsonData[i][6]["value"]);	//idoc
			mts_data[8].push(jsonData[i][11]["value"]);	//shipped qty
			mts_data[12].push(jsonData[i][4]["value"]);	//default delivery plant
			if(jsonData[i][13]["value"] == "%null%"){mts_data[9].push("0");}else{mts_data[9].push(jsonData[i][13]["value"]);}	//demand qty
			mts_data[10].push(final_call_off);	//final call off
			// if(jsonData[i][11]["value"] == "%null%"){mts_data[11].push("0");}else{mts_data[11].push(jsonData[i][11]["value"]);}
			mts_data[11].push(rfinal_call_off);	//review week final call off
			p_sw = snapshot_week;
			p_order_no = jsonData[i][0]["value"];
		}
		if(flag_order_array.includes("Yes")){
			for(j=0;j<len_order_jsonData;j++){
				if(flag_order_array[j] == "Yes"){
					mts_data[0].push("*"+p_sw);	//snapshot calendar week
					mts_data[1].push("Line does not exist");	//schedule line
					mts_data[2].push(mts_mto_order_data[j][4]["value"]);	//order number
					mts_data[3].push(mts_mto_order_data[j][3]["value"]);	//order item
					mts_data[4].push("Line does not exist");	//delivery schedule date
					mts_data[5].push(mts_mto_order_data[j][0]["value"]);	//ship date
					mts_data[6].push(mts_mto_order_data[j][1]["value"]);	//dock date
					mts_data[7].push("Line does not exist");	//idoc
					mts_data[8].push("0");	//shipped qty
					mts_data[12].push("Line does not exist");	//default delivery plant
					mts_data[9].push("0");	//demand qty
					mts_data[10].push(mts_mto_order_data[j][5]["value"]);	//final call off
					mts_data[11].push(mts_mto_order_data[j][6]["value"]);	//review week final call off
					mts_agg_data[0][mts_agg_data[0].length-1] += 1; 
				}
			}
		}
		d_year = parseInt(year); d_week = parseInt(week);
		if(d_week == 1){dweek = 52; d_year = d_year - 1;}else{d_week = d_week - 1;}
		n_snapshot_week = parseInt(concoctYearWeek(d_year,d_week));
		while(n_snapshot_week > n_start_week){
			for(i=0;i<len_order_jsonData;i++){
				temp = start_week.toString();
				if(temp.length == 1){temp = "0" + temp;}
				c_sw = start_year.toString() + temp;
				p_sw = c_sw;
				mts_data[0].push("*" + c_sw);	//snapshot calendar week
				mts_data[1].push("Line does not exist");	//schedule line
				mts_data[4].push("Line does not exist");	//delivery schedule date
				mts_data[7].push("Line does not exist");	//idoc
				mts_data[8].push("0");	//shipped qty
				mts_data[9].push("0");	//demand qty
				mts_data[12].push("Line does not exist");	//default delivery plant
				if(len_order_jsonData >0){	//check if order data is available
					mts_data[2].push(mts_mto_order_data[i][4]["value"]);	//order number
					mts_data[3].push(mts_mto_order_data[i][3]["value"]);	//order item
					mts_data[5].push(mts_mto_order_data[i][0]["value"]);	//ship date
					mts_data[6].push(mts_mto_order_data[i][1]["value"]);	//dock date
					mts_data[10].push(mts_mto_order_data[i][5]["value"]);	//final call off
					mts_data[11].push(mts_mto_order_data[i][6]["value"]);	//review week final call off
				}else{	//if no order data available
					mts_data[2].push("Line does not exist");	//order number
					mts_data[3].push("Line does not exist");	//order item
					mts_data[5].push("Line does not exist");	//ship date
					mts_data[6].push("Line does not exist");	//dock date
					mts_data[10].push("0");	//final call off
					mts_data[11].push("0");	//review week final call off
				}
			}
			if(len_order_jsonData > 0){
				mts_agg_data[0].push(len_order_jsonData);	//row_count
				mts_agg_data[1].push(0);	//agg demand qty
				mts_agg_data[2].push(agg_final_call_off);	//agg final call off
				mts_agg_data[3].push(calPerVariance(0,agg_final_call_off));	//% variance
				mts_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
				mts_agg_data[5].push(calPerVariance(0,agg_rfinal_call_off));	//% review week variance
				if(p2_lower_per == -1){mts_agg_data[6].push("Not Deviated");}	//weekly decision
				else{
					mts_agg_data[6].push("Deviated");
					final_dec = "Deviated";
				}
			}else{
				mts_agg_data[0].push(1);	//row_count
				mts_agg_data[1].push(0);	//agg demand qty
				mts_agg_data[2].push(0);	//agg final call off
				mts_agg_data[3].push(0);	//% variance
				mts_agg_data[4].push(0);	//agg review week final call off
				mts_agg_data[5].push(0);	//% review week variance
				if(p2_lower_per == -1){mts_agg_data[6].push("Not Deviated");}	//weekly decision
				else{
					mts_agg_data[6].push("Deviated");
					final_dec = "Deviated";
				}
			}
			if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
			n_start_week = parseInt(concoctYearWeek(start_year, start_week));
		}
	}
	temp = mts_agg_data[6].length;
	for(i=0; i<temp; i++){
		if(mts_agg_data[6][i] == "Deviated"){final_dec = "Deviated"; break;}
	}
	period_str = '<span style="font-size: 1em; line-height: 23px;">Frozen Zone '+p1_ul_week.toString()+' Week/s ('+(p1_lower_per*100).toString()+'% &#10231; '+(p1_upper_per*100).toString()+'%)</span><br />'+
		'<span style="font-size: 1em; line-height: 23px;padding-top:50px;">Flex Zone '+(p2_ul_week-p1_ul_week).toString()+' Week/s ('+(p2_lower_per*100).toString()+'% &#10231; '+(p2_upper_per*100).toString()+'%)</span>';
	document.getElementById("period").innerHTML = period_str;
	oth_pdf[1] = "Frozen Zone : " + p1_ul_week.toString() + " Week/s (" + (p1_lower_per*100).toString()+ "% - " + (p1_upper_per*100).toString() + "%) Flex Zone : " + (p2_ul_week-p1_ul_week).toString() + " Week/s (" + (p2_lower_per*100).toString() + "% - "+ (p2_upper_per*100).toString() + "%)";
	finalLogicTwo(mts_data,mts_agg_data,final_dec);
	}catch(e){
		console.log(e);
	}
}

function initMTO(){
	flowNum=221;
	var options={
		"RLT Weeks": rlt_week,
		"Year": year,
		"Week": week
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week Number"] = year + week;
	selectViz("vizContainer3", "MTS-FinalCallOff", options);
}

function readMTOOrder(jsonData){
	mts_mto_order_data = jsonData;
	getMTODemand();
}

function getMTODemand(){
	flowNum=222;
	var options={
		"RLT Weeks": rlt_week,
		"Year": year,
		"Week": week
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week"] = year + week;
	selectViz("vizContainer4", "MTO-Demand", options);
}

function readMTODemand(jsonData){
	try{
	var len_jsonData = jsonData.length, len_agg_data, len_order_jsonData=mts_mto_order_data.length,
	i, j, mto_data=[[],[],[],[],[],[],[],[],[],[],[],[],[]], mto_agg_data=[[],[],[],[],[],[],[]], flag_order_array=[], row_count = 0, snapshot_week, variance_per, rvariance_per, weekly_dec, final_dec = "Not Deviated", demand_qty = 0, final_call_off = 0, rfinal_call_off = 0, week_diff, i_doc, period_str,
	s_year = parseInt(year), s_week = parseInt(week), start_year, start_week, d_year, d_week, c_sw, p_sw, p_order_no, temp, n_snapshot_week, n_start_week,
	d_order_no, o_order_no, d_order_item, o_order_item, d_ship_date, o_ship_date, agg_final_call_off=0, agg_rfinal_call_off=0;
	
	//populate flag_order_array with default 'Yes', number equal to number of records retrieved in order request
	for(i=0;i<len_order_jsonData;i++){
		flag_order_array.push("Yes");
		agg_final_call_off += parseInt(mts_mto_order_data[i][5]["value"]);
		agg_rfinal_call_off += parseInt(mts_mto_order_data[i][6]["value"]);
	}
	
	if(s_week-rlt_week <= 0){
		start_year = s_year-1;
		start_week = 52-Math.abs(s_week-rlt_week);
	}else{
		start_year = s_year;
		start_week = s_week-rlt_week;
	}
	
	temp = start_week.toString();
	if(temp.length == 1){temp = "0" + temp;}
	p_sw = start_year.toString() + temp;
	
	if(len_jsonData == 0){
		d_year = s_year; d_week = s_week;
		n_start_week = parseInt(concoctYearWeek(start_year, start_week));
		while(n_snapshot_week > n_start_week){
			for(i=0;i<len_order_jsonData;i++){
				temp = start_week.toString();
				if(temp.length == 1){temp = "0" + temp;}
				c_sw = start_year.toString() + temp;
				p_sw = c_sw;
				mto_data[0].push("*" + c_sw);	//snapshot calendar week
				mto_data[1].push("Line does not exist");	//schedule line
				mto_data[4].push("Line does not exist");	//delivery schedule date
				mto_data[7].push("Line does not exist");	//idoc
				mto_data[8].push("0");	//shipped qty
				mto_data[9].push("0");	//demand qty
				mto_data[12].push("Line does not exist");	//default delivery plant
				if(len_order_jsonData > 0){	//check if order data is available
					mto_data[2].push(mts_mto_order_data[i][4]["value"]);	//order number
					mto_data[3].push(mts_mto_order_data[i][3]["value"]);	//order item
					mto_data[5].push(mts_mto_order_data[i][0]["value"]);	//ship date
					mto_data[6].push(mts_mto_order_data[i][1]["value"]);	//dock date
					mto_data[10].push(mts_mto_order_data[i][5]["value"]);	//final call off
					mto_data[11].push(mts_mto_order_data[i][6]["value"]);	//review week final call off
				}else{	//if no order data available
					mto_data[2].push("Line does not exist");	//order number
					mto_data[3].push("Line does not exist");	//order item
					mto_data[5].push("Line does not exist");	//ship date
					mto_data[6].push("Line does not exist");	//dock date
					mto_data[10].push("0");	//final call off
					mto_data[11].push("0");	//review week final call off
				}
			}
			if(len_order_jsonData > 0){
				mto_agg_data[0].push(len_order_jsonData);	//row_count
				mto_agg_data[1].push(0);	//agg demand qty
				mto_agg_data[2].push(agg_final_call_off);	//agg final call off
				mto_agg_data[3].push(calPerVariance(0,agg_final_call_off));	//% variance
				mto_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
				mto_agg_data[5].push(calPerVariance(0,agg_rfinal_call_off));	//% review week variance
				if(p2_lower_per == -1){mto_agg_data[6].push("Not Deviated");}	//weekly decision
				else{
					mto_agg_data[6].push("Deviated");
					final_dec = "Deviated";
				}
			}else{
				mto_agg_data[0].push(1);	//row_count
				mto_agg_data[1].push(0);	//agg demand qty
				mto_agg_data[2].push(0);	//agg final call off
				mto_agg_data[3].push(0);	//% variance
				mto_agg_data[4].push(0);	//agg review week final call off
				mto_agg_data[5].push(0);	//% review week variance
				if(p2_lower_per == -1){mto_agg_data[6].push("Not Deviated");}	//weekly decision
				else{
					mto_agg_data[6].push("Deviated");
					final_dec = "Deviated";
				}
			}
			if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
			n_start_week = parseInt(concoctYearWeek(start_year, start_week));
		}
	}else{
		for(i=0;i<len_jsonData;i++){
			snapshot_week = jsonData[i][10]["value"]; //moved here to make sure that the condition to compare previous and current snapshots
			if(i==0){p_sw = snapshot_week;}	//init p_sw with first snapshot_week
			if(snapshot_week != p_sw){	//check and create data for demand if order data is available
				if(flag_order_array.includes("Yes")){
					for(j=0;j<len_order_jsonData;j++){
						if(flag_order_array[j] == "Yes"){
							mto_data[0].push("*"+p_sw);	//snapshot calendar week
							mto_data[1].push("Line does not exist");	//schedule line
							mto_data[2].push(mts_mto_order_data[j][4]["value"]);	//order number
							mto_data[3].push(mts_mto_order_data[j][3]["value"]);	//order item
							mto_data[4].push("Line does not exist");	//delivery schedule date
							mto_data[5].push(mts_mto_order_data[j][0]["value"]);	//ship date
							mto_data[6].push(mts_mto_order_data[j][1]["value"]);	//dock date
							mto_data[7].push("Line does not exist");	//idoc
							mto_data[8].push("0");	//shipped qty
							mto_data[12].push("Line does not exist");	//default delivery plant
							mto_data[9].push("0");	//demand qty
							mto_data[10].push(mts_mto_order_data[j][5]["value"]);	//final call off
							mto_data[11].push(mts_mto_order_data[j][6]["value"]);	//review week final call off
							mto_agg_data[0][mto_agg_data[0].length-1] += 1; 
						}
						flag_order_array[j] = "Yes";	//reset flag_order_array values
					}
				}
			}else{
				
			}
			n_start_week = parseInt(concoctYearWeek(start_year, start_week));
			len_agg_data = mto_agg_data[0].length;
			n_snapshot_week = parseInt(snapshot_week);
			d_year = parseInt(snapshot_week.substring(0,4));
			d_week = parseInt(snapshot_week.substring(4,6));
			week_diff = parseInt(jsonData[i][8]["value"]);
			demand_qty = jsonData[i][13]["value"];
			if(demand_qty == "%null%"){demand_qty = 0;}else{demand_qty = parseFloat(demand_qty);}
			d_order_no = jsonData[i][0]["value"];
			d_order_item = jsonData[i][7]["value"];
			d_ship_date = jsonData[i][3]["value"];
			
			for(j=0;j<len_order_jsonData;j++){
				o_order_no = mts_mto_order_data[j][4]["value"];
				o_order_item = mts_mto_order_data[j][3]["value"];
				o_ship_date = mts_mto_order_data[j][0]["value"];
				if(d_order_no == o_order_no && d_order_item == o_order_item && d_ship_date == o_ship_date){// blend check between demand and order for fields order no, order item no and ship date
					flag_order_array[j] = "No";
					final_call_off = mts_mto_order_data[j][5]["value"];
					rfinal_call_off = mts_mto_order_data[j][6]["value"];
					break;
				}else{
					final_call_off = 0;
					rfinal_call_off = 0;
				}
			}
			
			if(final_call_off == "%null%"){final_call_off = 0;}else{final_call_off = parseFloat(final_call_off);}
			if(rfinal_call_off == "%null%"){rfinal_call_off = 0;}else{rfinal_call_off = parseFloat(rfinal_call_off);}
			
			while(n_snapshot_week > n_start_week){
				for(j=0;j<len_order_jsonData;j++){
					temp = start_week.toString();
					if(temp.length == 1){temp = "0" + temp;}
					c_sw = start_year.toString() + temp;
					p_sw = c_sw;
					mto_data[0].push("*" + c_sw);	//snapshot calendar week
					mto_data[1].push("Line does not exist");	//schedule line
					mto_data[4].push("Line does not exist");	//delivery schedule date
					mto_data[7].push("Line does not exist");	//idoc
					mto_data[8].push("0");	//shipped qty
					mto_data[9].push("0");	//demand qty
					mto_data[12].push("Line does not exist");	//default delivery plant
					if(len_order_jsonData > 0){	//check if order data is available
						mto_data[2].push(mts_mto_order_data[j][4]["value"]);	//order number
						mto_data[3].push(mts_mto_order_data[j][3]["value"]);	//order item
						mto_data[5].push(mts_mto_order_data[j][0]["value"]);	//ship date
						mto_data[6].push(mts_mto_order_data[j][1]["value"]);	//dock date
						mto_data[10].push(mts_mto_order_data[j][5]["value"]);	//final call off
						mto_data[11].push(mts_mto_order_data[j][6]["value"]);	//review week final call off
					}else{	//if no order data available
						mto_data[2].push("Line does not exist");	//order number
						mto_data[3].push("Line does not exist");	//order item
						mto_data[5].push("Line does not exist");	//ship date
						mto_data[6].push("Line does not exist");	//dock date
						mto_data[10].push("0");	//final call off
						mto_data[11].push("0");	//review week final call off
					}
				}
				if(len_order_jsonData > 0){
					mto_agg_data[0].push(len_order_jsonData);	//row_count
					mto_agg_data[1].push(0);	//agg demand qty
					mto_agg_data[2].push(agg_final_call_off);	//agg final call off
					mto_agg_data[3].push(calPerVariance(0,agg_final_call_off));	//% variance
					mto_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
					mto_agg_data[5].push(calPerVariance(0,agg_rfinal_call_off));	//% review week variance
					if(p2_lower_per == -1){mto_agg_data[6].push("Not Deviated");}	//weekly decision
					else{
						mto_agg_data[6].push("Deviated");
						final_dec = "Deviated";
					}
				}else{
					mto_agg_data[0].push(1);	//row_count
					mto_agg_data[1].push(0);	//agg demand qty
					mto_agg_data[2].push(0);	//agg final call off
					mto_agg_data[3].push(0);	//% variance
					mto_agg_data[4].push(0);	//agg review week final call off
					mto_agg_data[5].push(0);	//% review week variance
					if(p2_lower_per == -1){mto_agg_data[6].push("Not Deviated");}	//weekly decision
					else{
						mto_agg_data[6].push("Deviated");
						final_dec = "Deviated";
					}
				}
				if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
				n_start_week = parseInt(concoctYearWeek(start_year, start_week));
			}
			
			if(year == snapshot_week.substring(0,4) && week == snapshot_week.substring(4,6)){break;}
			if(snapshot_week == p_sw && len_agg_data != 0){
				temp = len_agg_data-1;
				mto_agg_data[0][temp] += 1; //row count
				mto_agg_data[1][temp] += demand_qty; //agg demand qty
				// if(jsonData[i][0]["value"] == p_order_no){	//if same order no. in same snapshot week, dont sum up final call off
					// //do nothing or dont sum
				// }else{
					// mto_agg_data[2][temp] += final_call_off; //agg final call off
					// mto_agg_data[4][temp] += rfinal_call_off; //agg review week final call off
				// }
				variance_per = calPerVariance(mto_agg_data[1][temp], agg_final_call_off);
				mto_agg_data[3][temp] = variance_per.toFixed(2); //% variance
				rvariance_per = calPerVariance(mto_agg_data[1][temp], agg_rfinal_call_off);
				mto_agg_data[5][temp] = rvariance_per.toFixed(2); //% review week variance
				if(rvariance_per==0){weekly_dec = "Not Deviated";}else{weekly_dec = "Deviated";}
				mto_agg_data[6][temp] = weekly_dec;	//weekly decision
			}else{
				mto_agg_data[0].push(1);	//row_count
				mto_agg_data[1].push(demand_qty);	//agg demand qty
				mto_agg_data[2].push(agg_final_call_off);	//agg final call off
				variance_per = calPerVariance(demand_qty, agg_final_call_off);
				mto_agg_data[3].push(variance_per.toFixed(2));	//% variance
				mto_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
				rvariance_per = calPerVariance(demand_qty, agg_rfinal_call_off);
				mto_agg_data[5].push(rvariance_per.toFixed(2));	//% review week variance
				if(rvariance_per==0){weekly_dec = "Not Deviated";}else{weekly_dec = "Deviated";}
				mto_agg_data[6].push(weekly_dec);	//weekly decision
				if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
			}

			mto_data[0].push(snapshot_week);	//snapshot calendar week
			mto_data[1].push(jsonData[i][9]["value"]);	//schedule line
			mto_data[2].push(jsonData[i][0]["value"]);	//order number
			mto_data[3].push(jsonData[i][7]["value"]);	//order item
			mto_data[4].push(jsonData[i][5]["value"]);	//delivery schedule date
			mto_data[5].push(jsonData[i][3]["value"]);	//ship date
			mto_data[6].push(jsonData[i][1]["value"]);	//dock date
			mto_data[7].push(jsonData[i][6]["value"]);	//idoc
			mto_data[8].push(jsonData[i][11]["value"]);	//shipped qty
			mto_data[12].push(jsonData[i][4]["value"]);	//default delivery plant
			if(jsonData[i][13]["value"] == "%null%"){mto_data[9].push("0");}else{mto_data[9].push(jsonData[i][13]["value"]);}	//demand qty
			mto_data[10].push(final_call_off);	//final call off
			mto_data[11].push(rfinal_call_off);	//review week final call off
			p_sw = snapshot_week;
			p_order_no = jsonData[i][0]["value"];
			
		}
		if(flag_order_array.includes("Yes")){
			for(j=0;j<len_order_jsonData;j++){
				if(flag_order_array[j] == "Yes"){
					mto_data[0].push("*"+p_sw);	//snapshot calendar week
					mto_data[1].push("Line does not exist");	//schedule line
					mto_data[2].push(mts_mto_order_data[j][4]["value"]);	//order number
					mto_data[3].push(mts_mto_order_data[j][3]["value"]);	//order item
					mto_data[4].push("Line does not exist");	//delivery schedule date
					mto_data[5].push(mts_mto_order_data[j][0]["value"]);	//ship date
					mto_data[6].push(mts_mto_order_data[j][1]["value"]);	//dock date
					mto_data[7].push("Line does not exist");	//idoc
					mto_data[8].push("0");	//shipped qty
					mto_data[12].push("Line does not exist");	//default delivery plant
					mto_data[9].push("0");	//demand qty
					mto_data[10].push(mts_mto_order_data[j][5]["value"]);	//final call off
					mto_data[11].push(mts_mto_order_data[j][6]["value"]);	//review week final call off
					mto_agg_data[0][mto_agg_data[0].length-1] += 1; 
				}
			}
		}
		
		d_year = parseInt(year); d_week = parseInt(week);
		if(d_week == 1){dweek = 52; d_year = d_year - 1;}else{d_week = d_week - 1;}
		n_snapshot_week = parseInt(concoctYearWeek(d_year,d_week));
		while(n_snapshot_week > n_start_week){
			for(i=0;i<len_order_jsonData;i++){
					temp = start_week.toString();
					if(temp.length == 1){temp = "0" + temp;}
					c_sw = start_year.toString() + temp;
					p_sw = c_sw;
					mto_data[0].push("*" + c_sw);	//snapshot calendar week
					mto_data[1].push("Line does not exist");	//schedule line
					mto_data[4].push("Line does not exist");	//delivery schedule date
					mto_data[7].push("Line does not exist");	//idoc
					mto_data[8].push("0");	//shipped qty
					mto_data[9].push("0");	//demand qty
					mto_data[12].push("Line does not exist");	//default delivery plant
					if(len_order_jsonData > 0){	//check if order data is available
						mto_data[2].push(mts_mto_order_data[i][4]["value"]);	//order number
						mto_data[3].push(mts_mto_order_data[i][3]["value"]);	//order item
						mto_data[5].push(mts_mto_order_data[i][0]["value"]);	//ship date
						mto_data[6].push(mts_mto_order_data[i][1]["value"]);	//dock date
						mto_data[10].push(mts_mto_order_data[i][5]["value"]);	//final call off
						mto_data[11].push(mts_mto_order_data[i][6]["value"]);	//review week final call off
					}else{	//if no order data available
						mto_data[2].push("Line does not exist");	//order number
						mto_data[3].push("Line does not exist");	//order item
						mto_data[5].push("Line does not exist");	//ship date
						mto_data[6].push("Line does not exist");	//dock date
						mto_data[10].push("0");	//final call off
						mto_data[11].push("0");	//review week final call off
					}
				}
				if(len_order_jsonData > 0){
					mto_agg_data[0].push(len_order_jsonData);	//row_count
					mto_agg_data[1].push(0);	//agg demand qty
					mto_agg_data[2].push(agg_final_call_off);	//agg final call off
					mto_agg_data[3].push(calPerVariance(0,agg_final_call_off));	//% variance
					mto_agg_data[4].push(agg_rfinal_call_off);	//agg review week final call off
					mto_agg_data[5].push(calPerVariance(0,agg_rfinal_call_off));	//% review week variance
					if(p2_lower_per == -1){mto_agg_data[6].push("Not Deviated");}	//weekly decision
					else{
						mto_agg_data[6].push("Deviated");
						final_dec = "Deviated";
					}
				}else{
					mto_agg_data[0].push(1);	//row_count
					mto_agg_data[1].push(0);	//agg demand qty
					mto_agg_data[2].push(0);	//agg final call off
					mto_agg_data[3].push(0);	//% variance
					mto_agg_data[4].push(0);	//agg review week final call off
					mto_agg_data[5].push(0);	//% review week variance
					if(p2_lower_per == -1){mto_agg_data[6].push("Not Deviated");}	//weekly decision
					else{
						mto_agg_data[6].push("Deviated");
						final_dec = "Deviated";
					}
				}
				if(start_week == 52){start_year += 1;start_week = 1;}else{start_week += 1;}
				n_start_week = parseInt(concoctYearWeek(start_year, start_week));
		}
	}
	temp = mto_agg_data[6].length;
	for(i=0; i<temp; i++){
		if(mto_agg_data[6][i] == "Deviated"){final_dec = "Deviated"; break;}
	}
	if((short_term_flex == "no" || short_term_flex == "%null%") && part_type == "Make to Stock" && safety_stock == "yes"){
		period_str = '<span style="font-size: 1em; line-height: 46px;">';
		period_str += 'Stated Lead Time<br />'+rlt_week.toString()+' Weeks</span>';
		oth_pdf[1] = "Stated Lead Time : " + rlt_week.toString() + " Weeks";
	}else if((short_term_flex == "no" || short_term_flex == "%null%") && part_type == "Make to Order" && safety_stock == "yes"){
		period_str = '<span style="font-size: 1em; line-height: 23px;">';
		period_str += rlt_week.toString()+' Weeks</span>';
		period_str += '<br /><span style="font-size: 1em; line-height: 23px;">';
		period_str += '<b>Stated Lead Time</b> '+stated_lead_time+' Weeks</span>';
		oth_pdf[1] = "Replenishment Lead Time : " + rlt_week.toString() + " Week";
	}else{
		period_str = '<span style="font-size: 1em; line-height: 46px;">';
		period_str += rlt_week.toString()+' Weeks</span>';
		oth_pdf[1] = "Replenishment Lead Time : " + rlt_week.toString() + " Week";
	}
	}catch(e){console.log(e);}
	document.getElementById("period").innerHTML = period_str;
	finalLogicTwo(mto_data,mto_agg_data,final_dec);
}

function finalLogicTwo(logicTwoData,logicTwoAggData,final_dec){
	var len_data = logicTwoData[0].length,
	i, str_table, ele_handle, iter=0, j=0, temp, temp_pdf=[], f_temp_pdf=[];
	str_table = '<table><tr align="center"><th>Snapshot Calendar Week</th><th>Schedule Line</th><th>Order #</th><th>Order Item #</th><th>Default Delivery Plant</th><th>Delivery Schedule Date</th><th>Ship Date</th><th>Dock Date</th><th>IDOC Number</th><th>Shipped Quantity</th><th>Demand Quantity</th><th>Final CallOff</th><th>Review Week Final CallOff</th><th>Total Demand Quantity</th><th>Total Final CallOff</th><th>% Variance</th><th>Total Review Week Final CallOff</th><th>% Review Week Variance</th><th>Status</th></tr>';
	stf_data_pdf.push(["Snapshot Calendar Week","Schedule Line","Order #","Order Item #","Default Delivery Plant","Delivery Schedule Date","Ship Date","Dock Date","IDOC Number","Shipped Quantity","Demand Quantity","Final CallOff","Review Week Final CallOff","Total Demand Quantity","Total Final CallOff","% Variance","Total Review Week Final CallOff","% Review Week Variance","Status"]);
	for(i=0;i<len_data;i++){
		temp = logicTwoData[0][i];
		str_table += '<tr align="center"';
		if(temp.includes("*")){
			str_table += ' class="missingWeek">';
		}else{
			str_table += '>';
		}
		str_table += '<td>'+logicTwoData[0][i]+'</td><td>'+logicTwoData[1][i]+'</td><td>'+logicTwoData[2][i]+'</td><td>'+logicTwoData[3][i]+'</td><td>'+logicTwoData[12][i]+'</td><td>'+logicTwoData[4][i].toString()+'</td><td>'+logicTwoData[5][i]+'</td><td>'+logicTwoData[6][i]+'</td><td>'+logicTwoData[7][i]+'</td><td>'+Math.round(parseFloat(logicTwoData[8][i])).toLocaleString('en')+'</td><td>'+Math.round(parseFloat(logicTwoData[9][i])).toLocaleString('en')+'</td><td>'+Math.round(parseFloat(logicTwoData[10][i])).toLocaleString('en')+'</td><td>'+Math.round(parseFloat(logicTwoData[11][i])).toLocaleString('en')+'</td>';
		temp_pdf.push(logicTwoData[0][i],logicTwoData[1][i],logicTwoData[2][i],logicTwoData[3][i],logicTwoData[12][i],logicTwoData[4][i],logicTwoData[5][i],logicTwoData[6][i],logicTwoData[7][i],Math.round(parseFloat(logicTwoData[8][i])).toLocaleString('en'),Math.round(parseFloat(logicTwoData[9][i])).toLocaleString('en'),Math.round(parseFloat(logicTwoData[10][i])).toLocaleString('en'),Math.round(parseFloat(logicTwoData[11][i])).toLocaleString('en'));
		temp = logicTwoAggData[0][j];
		temp_pdf.push(Math.round(parseFloat(logicTwoAggData[1][j])).toLocaleString('en'), Math.round(parseFloat(logicTwoAggData[2][j])).toLocaleString('en'), Math.round(logicTwoAggData[3][j]*100).toString()+' %', Math.round(parseFloat(logicTwoAggData[4][j])).toLocaleString('en'), Math.round(logicTwoAggData[5][j]*100).toString()+' %', logicTwoAggData[6][j]);
		if(iter == 0){
			temp = logicTwoAggData[0][j];
			str_table += '<td rowspan="'+temp+'">'+Math.round(parseFloat(logicTwoAggData[1][j])).toLocaleString('en')+'</td><td rowspan="'+temp+'">'+Math.round(parseFloat(logicTwoAggData[2][j])).toLocaleString('en')+'</td><td rowspan="'+temp+'">'+(Math.round(logicTwoAggData[3][j]*100)).toString()+' %';
			if(logicTwoAggData[3][j]>0){
				str_table += '&nbsp;&nbsp;<img src="Images/arrow-up.jpg" class="img_arrow" />';
			}else if(logicTwoAggData[3][j]<0){
				str_table += '&nbsp;&nbsp;<img src="Images/arrow-down.jpg" class="img_arrow" />';
			}
			str_table += '</td><td rowspan="'+temp+'">'+Math.round(parseFloat(logicTwoAggData[4][j])).toLocaleString('en')+'</td><td rowspan="'+temp+'">'+(Math.round(logicTwoAggData[5][j]*100)).toString()+' %';	
			if(logicTwoAggData[5][j]>0){
				str_table += '&nbsp;&nbsp;<img src="Images/arrow-up.jpg" class="img_arrow" />';
			}else if(logicTwoAggData[5][j]<0){
				str_table += '&nbsp;&nbsp;<img src="Images/arrow-down.jpg" class="img_arrow" />';
			}
			str_table += '</td><td rowspan="'+temp+'"';
			temp = logicTwoAggData[6][j];
			if(temp == "Deviated"){
				str_table += ' class="decisionRed"';
			}else{
				str_table += ' class="decisionGreen"';
			}
			str_table += '>'+temp+'</td>';
		}
		str_table += '</tr>';
		iter += 1;
		if(iter == logicTwoAggData[0][j]){iter = 0;j += 1;}
		f_temp_pdf.push(temp_pdf);
		temp_pdf=[];
	}
	str_table += '</table>';
	stf_data_pdf.push(f_temp_pdf);
	if(final_dec == "Deviated"){
		// document.getElementById("logic2_dvt").src = "./images/no.png";
		fillData("dvt2_status", "no", " Deviated");

		contract_details_pdf[5] = ["Short Term Forecast", ": Customer Deviated"];
	}else if(final_dec == "Not Deviated"){
		// document.getElementById("logic2_not_dvt").src = "./images/yes.png";
		fillData("dvt2_status", "yes", " Not Deviated");

		contract_details_pdf[5] = ["Short Term Forecast", ": Customer Not Deviated"];
	}
	logic2_f_str = str_table;
	ele_handle = document.getElementById("logic2_button");
	temp = ele_handle.className;
	ele_handle.className = temp+" glowbutton";
	ele_handle.onclick = function() {openDataOverlay(logic2_f_str);};
	finalDec(final_dec);
}



function finalDec(logic2_dec){
	var final_dec;
	if(logic1_dec == "Deviated" || logic2_dec=="Deviated"){
		// document.getElementById("fd_cust_liable").src = "./images/yes.png";
		_("fd_liabla").innerHTML = '<img class="output_image" src="./images/yes.png">' + ' <img class="customerImg" src="./images/customer.png" title="Customer">' + " Customer Liable";
		final_dec = "Customer Liable";
		contract_details_pdf[6] = ["Final Decision", ": Customer Liable"];
	}else{
		// document.getElementById("fd_te_liable").src = "./images/no.png";
		_("fd_liabla").innerHTML = '<img class="output_image" src="./images/no.png">' + ' <img class="teImg" src="./images/te.png" title="TE">' + " TE Liable";
		
		final_dec = "TE Liable";
		contract_details_pdf[6] = ["Final Decision", ": TE Liable"];
	}
	
	
	swal("Short Term Forecast dtails obtained!");
	getOrderSummary();
}



function getOrderSummary(){
	flowNum=3;
	var options={
		"Year": year,
		"Week": week
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	options["Customer Request Ship Calendar Week Number"] = year + week;
	selectViz("vizContainer5", "Order-Split", options);
}

function readOrderSummary(jsonData){
	try{
	var len_jsonData = jsonData.length, i, ele_handle, temp, temp_pdf=[];
	order_summary_str = '<table><tr><th>Transaction Date</th><th>Order Number</th><th>Customer Request Ship Week</th><th>Customer Request Dock Week</th><th>Order Quantity</th><th>Running Total Order Quantity</th><th>Review Week Final CallOff</th><th>Running Total Review Week Final CallOff</th><th>Shipped Quantity</th></tr>';
	order_summary_data_pdf.push(["Transaction Date","Order Number","Customer Request Ship Week","Customer Request Dock Week","Order Quantity","Running Total Order Quantity","Review Week Final CallOff","Running Total Review Week Final CallOff"]);
	for(i=0; i<len_jsonData; i++){
		order_summary_str = order_summary_str + '<tr><td>' + jsonData[i][3]["value"] + '</td><td>' + jsonData[i][2]["value"] + '</td><td>' + jsonData[i][1]["value"] + '</td><td>' + jsonData[i][0]["value"] + '</td><td>' + jsonData[i][8]["value"] + '</td><td>' + jsonData[i][7]["value"] + '</td><td>' + jsonData[i][5]["value"] + '</td><td>' + jsonData[i][4]["value"] + '</td><td>'+ jsonData[i][6]["value"] + '</td></tr>';
		temp_pdf.push([jsonData[i][3]["value"], jsonData[i][2]["value"], jsonData[i][1]["value"], jsonData[i][0]["value"], jsonData[i][8]["value"], jsonData[i][7]["value"], jsonData[i][5]["value"], jsonData[i][4]["value"], jsonData[i][6]["value"]]);
	}
	order_summary_str = order_summary_str + '</table>';
	order_summary_data_pdf.push(temp_pdf);
	
	ele_handle = document.getElementById("order_summary_button");
	temp = ele_handle.className;
	ele_handle.className = temp+" glowbutton";
	ele_handle.onclick = function() {openDataOverlay(order_summary_str);};
	
	swal("Order Summary Obtained!");
	
	if(safety_stock=="yes"){getFinalCallOffForSafetyStock();}else{
		document.getElementById("buttonSubmit").innerHTML = "Reset";
		toggleElementAbility("buttonSubmit");
		document.getElementById("preloader").style.display = "none";
		document.getElementById("buttonSection").style.display = "block";
		document.getElementById("buttonRefresh").style.display = "block";
		ele_handle = document.getElementById("pdf_button");
		temp = ele_handle.className;
		ele_handle.className = temp + " glowbutton";
		ele_handle.onclick = function() {generatePDF();};
	}
	}catch(e){
		console.log(e);
	}
}

function getFinalCallOffForSafetyStock(){
	flowNum=41;
	var options={
		"Stated Lead Time P": stated_lead_time,
		"Year": year,
		"Week": week
		// "SS_Order_No": order_no,
		// "SS_Sales_Org": sales_org,
		// "SS_Sold_To": sold_to,
		// "SS_Ship_To": ship_to,
		// "SS_Material_No": material_no
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	selectViz("vizContainer6", "SafetyStock-FinalCallOff", options);
}

function readFinalCallOffForSafetyStock(jsonData){
	try{
	var len_jsonData = jsonData.length, t_yw = year+week,
	i, k, l, t_val, f_calloff_array = [], rf_calloff_array = [], shipped_qty_array = [], temp = 0;
	
	stated_lead_time = parseInt(stated_lead_time);
	
	//final call off array
	l=selected_crw_weekdiff+stated_lead_time;
	while(l >= selected_crw_weekdiff){
		temp += 1;
		for(i=0; i<len_jsonData; i++){
			k = parseInt(jsonData[i][1]["value"]);
			if(k==l){
				t_val = jsonData[i][3]["value"];
				if(t_val == "%null%"){f_calloff_array.push("0");}else{f_calloff_array.push(t_val);}	//final calloff
				t_val = jsonData[i][4]["value"];
				if(t_val == "%null%"){rf_calloff_array.push("0");}else{rf_calloff_array.push(t_val);}	//review week final calloff
				t_val = jsonData[i][2]["value"];
				if(t_val == "%null%"){shipped_qty_array.push("0");}else{shipped_qty_array.push(t_val);}	//shipped qty
				if(selected_crw_weekdiff == k){break;}
			}
		}
		if(temp != f_calloff_array.length){f_calloff_array.push("0");}
		if(temp != rf_calloff_array.length){rf_calloff_array.push("0");}
		if(temp != shipped_qty_array.length){shipped_qty_array.push("0");}
		l-=1;
	}
	ss_final_call_off = f_calloff_array;
	ss_rfinal_call_off = rf_calloff_array;
	ss_shipped_qty = shipped_qty_array;
	getDemandForSafetyStock();
	}catch(e){
		console.log(e);
	}
}

function getDemandForSafetyStock(){
	flowNum=42;
	var options={
		"Stated Lead Time P": stated_lead_time,
		"Year": year,
		"Week": week
		// "SS_Order_No": order_no,
		// "SS_Sales_Org": sales_org,
		// "SS_Sold_To": sold_to,
		// "SS_Ship_To": ship_to,
		// "SS_Material_No": material_no
	},
	newOptions = setOptions(), keyName;
	for (keyName in newOptions){options[keyName]=newOptions[keyName];}
	selectViz("vizContainer7", "SafetyStock-Demand", options);
}

function concoctYearWeek(s_year, s_week){
	var in_year=s_year, in_week=s_week, in_n_week;
	in_n_week = Math.floor(in_week/52);
	if(in_week<1){if(in_n_week==0){in_year=in_year-1;}else{in_year=s_year-Math.abs(in_n_week);}in_week=52+in_week;}
	in_year = in_year.toString();
	in_week = in_week.toString();
	if(in_week.length==1){in_week="0"+in_week;}
	return in_year+in_week;
}

function readDemandForSafetyStock(jsonData){
	var len_jsonData = jsonData.length,
	t_slt, t_year = parseInt(year), t_week = parseInt(week), iter_year, iter_week, n_iter_week, t_yw=year+week, t_crw_weekdiff, t_sw_weekdiff, t_val, t_val_array=[], final_sw_array=[], f_calloff_array=[], rf_calloff_array=[], shipped_qty_array=[], ll_crw, ul_crw, no_sw, limit_snapshots=8,
	n_row, n_col, tot_row, tot_safety_stock, te_committed_qty, min_te_committed_qty, min_req_qty, safety_stock_consumed, tpw_safety_stock_consumed, actual_te_liable_qty,
	i, j, k, l,	f_str="", t_str, inter_str="", diff_iter, r_iter, d_str="", ele_handle, temp, initRowPos_min_req_qty, t_head_pdf=[], t_body_pdf=[], tr_head_pdf=[], tr_body_pdf=[], tf_body_pdf=[];
	
	f_calloff_array = ss_final_call_off; //console.log(f_calloff_array);
	rf_calloff_array = ss_rfinal_call_off; //console.log(rf_calloff_array);
	shipped_qty_array = ss_shipped_qty; //console.log(shipped_qty_array);
	t_slt = stated_lead_time+1,	n_row=stated_lead_time, n_col=stated_lead_time+limit_snapshots-1;
	
	//first instance for selection of min_req_qty
	if(stated_lead_time > limit_snapshots){
		initRowPos_min_req_qty = stated_lead_time - limit_snapshots;
	}else{
		initRowPos_min_req_qty = 0;
	}
	
	ll_crw = selected_crw_weekdiff+(2*stated_lead_time-1);	//lower limit customer request Weeks relative to stated lead time 2n-1
	ul_crw = selected_crw_weekdiff-limit_snapshots+1;	//upper limit customer request Weeks relative to stated lead time 8-1 where 8 is fixed number of snapshots
	//number of required snapshot weeks relative to stated lead time 2n+1
	no_sw = 2*stated_lead_time;
	
	//get related snapshot weeks data from Tableau result set
	for(i=0;i<no_sw;i++){
		t_crw_weekdiff = ll_crw-i;
		t_val_array = [];
		for(j=1;j<=limit_snapshots;j++){
			if(len_jsonData == 0){
				t_val_array.push("0");
			}else{
				for(k=0;k<len_jsonData;k++){
					temp = parseInt(jsonData[k][1]["value"]); //parse c weekdiff as integer and assign it to temp
					//if(t_crw_weekdiff<ul_crw){break;}
					if(temp==t_crw_weekdiff && parseInt(jsonData[k][2]["value"])==j){
						t_val = jsonData[k][4]["value"];
						if(t_val == "%null%"){t_val_array.push("0");}else{t_val_array.push(t_val);}
						t_crw_weekdiff -= 1;
						break;
					}
					if(k == len_jsonData-1){
						if(t_val_array.length != j){
							t_crw_weekdiff -= 1;
							t_val_array.push("0");
						}
					}
				}
			}
		}
		final_sw_array.push(t_val_array);
	}
	//end get related snapshot weeks

	//get data in required format
	for(i=0;i<t_slt;i++){
		d_str = "";
		t_str = "";
		t_str += "<table>";
		//append CRWs as top header
		d_str+='<tr  align="center"><th></th>';
		tr_head_pdf.push("");
		for(l=0;l<n_col;l++){
			d_str += "<th>";
			iter_year = t_year;
			iter_week = t_week-(2*stated_lead_time-1)+l+i;
			temp = concoctYearWeek(iter_year, iter_week);
			d_str += temp;
			d_str += "</th>";
			tr_head_pdf.push(temp);
		}
		d_str+="<th>Total</th><th>Safety Stock</th><th>TE Committed Qty</th></tr>";
		tr_head_pdf.push("Total","Safety Stock", "TE Committed Qty");
		t_head_pdf.push(tr_head_pdf);
		tr_head_pdf=[];
		t_str+=d_str;
		d_str="";
		//end append CRWs as top header

		for(j=0;j<n_row;j++){
			tot_row = 0;
			tot_safety_stock = 0;
			te_committed_qty = 0;
			t_str += '<tr align="center">';
			//append SWs as side header
			d_str += "<th><b>";
			iter_year = t_year;
			iter_week = t_week-2*stated_lead_time+j+i;
			temp = concoctYearWeek(iter_year, iter_week);
			d_str += temp;
			d_str += "</b></th>";
			tr_body_pdf.push(temp);
			t_str += d_str;
			d_str = "";
			//end append SWs as side header
			for(k=0;k<n_col;k++){
				diff_iter=j-k;
				if(diff_iter>0 || diff_iter<stated_lead_time-n_col){
					t_str+="<td></td>";
					tr_body_pdf.push("");
					continue;
				}else{
					diff_iter = Math.abs(diff_iter);
					t_str += "<td>";
					t_val = parseInt(final_sw_array[j+i][diff_iter]);
					temp = Math.round(parseFloat(final_sw_array[j+i][diff_iter])).toLocaleString('en');
					t_str += temp;
					t_str += "</td>";
					tr_body_pdf.push(temp);
					tot_row += t_val;
					if(k==stated_lead_time-1){te_committed_qty = t_val;}
					if(j==initRowPos_min_req_qty && k==stated_lead_time-1){min_req_qty = t_val;}
					if(k == stated_lead_time-1){if(min_req_qty > t_val){min_req_qty = t_val;}}
				}
			}
			t_str += "<td>" + tot_row.toLocaleString('en') + "</td>";
			tot_safety_stock = (tot_row/limit_snapshots)*2;
			t_str += "<td>" + tot_safety_stock.toLocaleString('en') + "</td>";
			te_committed_qty += tot_safety_stock;
			if(j==0){min_te_committed_qty = te_committed_qty;}
			if(min_te_committed_qty > te_committed_qty){min_te_committed_qty = te_committed_qty;}
			t_str += "<td>" + te_committed_qty.toLocaleString('en') + "</td>" + "</tr>";
			tr_body_pdf.push(tot_row.toLocaleString('en'), tot_safety_stock.toLocaleString('en'), te_committed_qty.toLocaleString('en'));
			t_body_pdf.push(tr_body_pdf);
			tr_body_pdf = [];
		}
		
		//append final calloff
		d_str+='<tr align="center">';
		//append year-week for final calloff
		d_str += "<th><b>";
		iter_year = t_year;
		iter_week = t_week-stated_lead_time+i;
		temp = concoctYearWeek(iter_year, iter_week);
		d_str += temp;
		d_str += "</b></th>";
		tr_body_pdf.push(temp);
		//end append year-week for final calloff
		for(l=0;l<n_col;l++){
			d_str += "<td>";
			temp = "";
			if(l==stated_lead_time-1){
				temp = Math.round(parseFloat(rf_calloff_array[i])).toLocaleString('en');
				d_str += temp;
			}
			d_str += "</td>";
			tr_body_pdf.push(temp);
		}
		d_str += "</tr></table>";
		t_str += d_str;
		d_str = "";
		t_body_pdf.push(tr_body_pdf);
		tr_body_pdf=[];
		tf_body_pdf.push(t_body_pdf);
		t_body_pdf=[];
		//end append final calloff
		
		//safety stock table level calculations
		safety_stock_consumed = parseInt(rf_calloff_array[i])-min_req_qty;
		if(i == 0){
			actual_te_liable_qty = min_te_committed_qty;
			tpw_safety_stock_consumed = safety_stock_consumed;
			if(tpw_safety_stock_consumed < 0){tpw_safety_stock_consumed = 0;}
		}else{
			actual_te_liable_qty = min_te_committed_qty-tpw_safety_stock_consumed;
			tpw_safety_stock_consumed += safety_stock_consumed;
			if(tpw_safety_stock_consumed < 0){tpw_safety_stock_consumed = 0;}
		}
		d_str += "<table>";
		t_head_pdf.push(["Min TE Committed Quantity","Shipped Quantity","Final CallOff","Review Week Final CallOff","Min Requested Quantity","Safety Stock Consumed","Cumulative Safety Stock Consumed","Actual TE Liable Quantity"]);
		temp = min_te_committed_qty.toLocaleString('en');
		d_str += "<tr><th><b>Min TE Committed Quantity</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = Math.round(parseFloat(shipped_qty_array[i])).toLocaleString('en');
		d_str += "<tr><th><b>Shipped Quantity</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = Math.round(parseFloat(f_calloff_array[i])).toLocaleString('en');
		d_str += "<tr><th><b>Final CallOff</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = Math.round(parseFloat(rf_calloff_array[i])).toLocaleString('en');
		d_str += "<tr><th><b>Review Week Final CallOff</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = min_req_qty.toLocaleString('en');
		d_str += "<tr><th><b>Min Requested Quantity</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = safety_stock_consumed.toLocaleString('en');
		d_str += "<tr><th><b>Safety Stock Consumed</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = tpw_safety_stock_consumed.toLocaleString('en');
		d_str += "<tr><th><b>Cumulative Safety Stock Consumed</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		temp = actual_te_liable_qty.toLocaleString('en');
		d_str += "<tr><th><b>Actual TE Liable Quantity</b></th><td>" + temp + "</td></tr>";
		t_body_pdf.push(temp);
		d_str += "</table><p></p>";
		//end safety stock table level calculations
		f_str = t_str + d_str + f_str;
		tf_body_pdf.push([t_body_pdf]);
		t_body_pdf = [];
	}
	safety_stock_data_pdf.push(t_head_pdf, tf_body_pdf);
	safety_stock_f_str = f_str;
	ele_handle = document.getElementById("safety_stock_button");
	temp = ele_handle.className;
	ele_handle.className = temp + " glowbutton";
	ele_handle.onclick = function() {openDataOverlay(safety_stock_f_str);};
	document.getElementById("buttonSubmit").innerHTML = "Reset";
	toggleElementAbility("buttonSubmit");
	document.getElementById("preloader").style.display = "none";
	document.getElementById("buttonSection").style.display = "block";
	document.getElementById("buttonRefresh").style.display = "block";
	ele_handle = document.getElementById("pdf_button");
	temp = ele_handle.className;
	ele_handle.className = temp + " glowbutton";
	ele_handle.onclick = function() {generatePDF();};
	swal("Safety Stock details obtained!");
}

function init_app(){
	document.getElementById("buttonSection").style.display = 'none';
	document.getElementById("preloader").style.display = 'block';
	toggleElementAbility("buttonSubmit");
	initContractType();
}

function toggleElementAbility(eleId){
	var ele = document.getElementById(eleId);
	if(ele.disabled){ele.disabled = false;}else{ele.disabled = true;}
}

function clearOutput(type){
	var class_name =  "output_"+type,
	ele_handle = document.getElementsByClassName(class_name),
	len_handle = ele_handle.length,
	i;
	for(i=0;i<len_handle;i++){
		if(type == "text"){
			ele_handle[i].innerHTML = "";
		}else if(type == "image"){
			ele_handle[i].src = "";
		}
	}
}

function resetContent(){
	resetInputFields();
	resetVariables();
}

function resetInputFields(){
	var input_fields = document.getElementsByTagName("input"),
	i, len_input_array = input_fields.length;
	for(i=0;i<len_input_array;i++){input_fields[i].value = "";input_fields[i].disabled = "";}
	document.getElementById("year").value = "";
	document.getElementById("week").value = "";
}

function resetVariables(){
	var sheet_containers = document.getElementsByClassName("tabSheetContainer"),
	i, len_sc_array=sheet_containers.length, ele_handle, temp_len,
	buttonHandle = document.getElementById("buttonSubmit");
	for(i=0;i<len_sc_array;i++){sheet_containers[i].innerHTML = "";}
	clearOutput("text");
	clearOutput("image");
	ele_handle =  document.getElementsByClassName("data_button");
	temp_len = ele_handle.length;
	for(i=0;i<temp_len;i++){ele_handle[i].className = "data_button"; ele_handle[i].onclick = function(){};}
	document.getElementById("contract_type").innerHTML = "Contract Type";
	order_no=""; order_item_no=""; year=""; week=""; sold_to=""; sold_to_name=""; ship_to=""; ship_to_name="";
	material_no=""; sales_org=""; long_term_flex=""; short_term_flex=""; safety_stock=""; stated_lead_time=""; part_type=""; ww_number=""; ww_name="";
	s_ship_week=""; s_dock_week="";	ltf_demand_qty=""; ltf_final_calloff=""; ltf_r_final_calloff=""; ltf_shipped_qty=""; ltf_shipper_qty="";ltf_ship_week=""; ltf_dock_week="";
	logic1_dec=""; mts_mto=""; rlt_week="";
	p1_ll_week=""; p1_ul_week=""; p2_ll_week=""; p2_ul_week=""; p1_lower_per=""; p1_upper_per=""; p2_lower_per=""; p2_upper_per=""; ddp_no="";
	logic1_f_str=""; logic2_f_str=""; safety_stock_f_str=""; order_no_str=""; ship_to_str=""; sold_to_str=""; sales_org_str=""; order_summary_str=""; ddp_no_str="";
	selected_crw_weekdiff=""; ss_final_call_off=[]; ss_rfinal_call_off=[]; ss_shipped_qty=[]; week_type=""; mts_mto_order_data="";
	order_no_disp=""; order_item_no_disp=""; sales_org_disp=""; ship_to_disp=""; ship_to_name_disp=""; sold_to_disp=""; sold_to_name_disp=""; ddp_no_disp="";
	combo_details_pdf=[]; contract_details_pdf=[]; ltf_data_pdf=[]; stf_data_pdf=[]; order_summary_data_pdf=[]; safety_stock_data_pdf=[]; oth_pdf=[];
	flowNum=0;
	buttonHandle.innerHTML = "Submit";
	document.getElementById("preloader").style.display = "none";
	document.getElementById("buttonRefresh").style.display = "none";
	document.getElementById("buttonSection").style.display = "block";
}

function buttonClick(buttonContent){
	if(buttonContent=="Submit"){
		validate_fields();
		$("#onload").modal('toggle');
	}
	else if(buttonContent=="Reset"){resetContent();}
}

function generatePDF(){
	var doc = new jsPDF(), i, temp;
	
	doc.text("Order Details", 14, 20);
	doc.autoTable({body: combo_details_pdf, theme: 'plain', startY: 25, styles: {fontSize: 8}});
	
	doc.text("Contract Details", 14, doc.autoTable.previous.finalY + 10);
	doc.autoTable({body: contract_details_pdf, theme: 'plain', startY: doc.autoTable.previous.finalY + 15, styles: {fontSize: 8}});
	
	doc.addPage();
	doc.text("Long Term Forecast", 14, 20);
	doc.autoTable({head: [ltf_data_pdf[0]], body: ltf_data_pdf[1], startY: 25, styles: {fontSize: 5}});
	if(long_term_flex != "yes"){
		doc.text(oth_pdf[0], 14, doc.autoTable.previous.finalY + 10);
	}
	
	doc.addPage();
	doc.text("Short Term Forecast", 14, 20);
	doc.text(oth_pdf[1], 14, 30);
	doc.autoTable({head: [stf_data_pdf[0]], body: stf_data_pdf[1], startY: 35, styles: {fontSize: 5}});

	if(safety_stock == "yes"){
		doc.addPage();
		doc.text("Safety Stock", 14, 20);
		doc.text("Stated Lead Time : " + stated_lead_time + " Weeks", 14, 30);
	
		temp = safety_stock_data_pdf[0].length;
		for(i=0; i<temp; i++){
			if(i==0){
				doc.autoTable({head: [safety_stock_data_pdf[0][i]], body: safety_stock_data_pdf[1][i], startY: 35, styles: {fontSize: 5}});
			}else{
				doc.autoTable({head: [safety_stock_data_pdf[0][i]], body: safety_stock_data_pdf[1][i], styles: {fontSize: 5}});
			}
		}
	}

	doc.addPage();
	doc.text("Final CallOff/Order Summary", 14, 20);
	doc.autoTable({head: [order_summary_data_pdf[0]], body: order_summary_data_pdf[1],  startY: 25, styles: {fontSize: 5}});

	doc.save('lt.pdf');
}
