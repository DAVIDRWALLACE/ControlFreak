// control freak 1.0
// author David R Wallace
// requires libraries: jquery, conrolFreaksLibrary.js,customFreaksLibrary.js


// contents
// controlFreak
// .. drawControl() -- draw function
//.. getdata() --- ajax data getter
// .. iterate() --- iterator for multi-dimensional json
// -- bindLinks - event binder
// -- setFields -- two way  data binding


var controlFreak;

(function () {

	var customElements = ""
	 	

	function init() { }
	// main render function
	// if single element is passed, object is defined, merged into type html template, and returned as html for rendering
	// if array of control elements are passed, each control is rendered into html and html for group of controls is returned
	// this allows for grouping and hierarchical sections
	function drawControl(c, pControlArray,callback) {
		if (pControlArray.split(",").length>1) {
		
			var subRender = "";
			$.each(pControlArray.split(","), function (i, val) {
				subRender +=controlFreak.render(c,val,callback);
			})
			return subRender
		} else {
			c=$.extend(true,c, decorate(c, "reset",pControlArray))
			c=$.extend(true,c, decorate(c, pControlArray,""))
			var cc=c
			if (cc.type=="iterator") {
				controlFreak.iterate(c,function() {
						return controlFreak.bindLinks()
						},callback)
			} else {
			if (c.type=="ajaxhtml") {
				controlFreak.loadInserts(c);
			} else {
			var tHTML=""
			if (c.wrap=="true") {
				tHTML+=this.build(cc,cc.open)
			}
			tHTML+= this.build(cc,cc.type);
			if (cc.wrap=="true") {
			tHTML+=this.build(cc,cc.close)
			}
			
			if ((cc.paint=="true")&&(cc.container!="")) {
				if (cc.clear=="clear") {
					$("#children-" + cc.container).empty()
				}
			$("#children-" + cc.container).append(tHTML)	
				if ($.isFunction(callback)==true) {
					callback(cc)
				}
		
			} else {
				return tHTML
			}
		}
		}}
	}


	// **************** html control templates *************

	function draw(c,pType) { // templates
					for (var index in c) {
				if ($.isFunction(c[index])) {
					c[index] = c[index]()
				}
			};
		var elements = {
				"icon":"<a class='icon " + c.class + "' style='background:url(\"../icons/" + c.label + "\") 0 0 no-repeat transparent;'></a>",
				"textbox" : "<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  name='" + c.id + "'  id='" + c.id + "' />",
				"imagebutton" : "<a  title='" + c.label + "'  data-entity='" + c.Entity + "'  data-level='" + c.level + "' data-scope='" + c.SourceID + "' data-employeeIndex='" + c.employeeIndex + "' data-id='" + c.id + "' onClick=\"stopProp(event);" + c.action + "\" class='" + c.class + "' id='" + c.id + "' >" + c.value + "</a>",
				"link" : "<a class='" + c.class + "' data-id='" + c.id + "' data-section='" + c.id + "' data-target='" + c.target + "'  data-keyId='" + c.keyId + "' data-index='" + c.index + "' title='" + c.label + "' href='javascript:void(0);' id='link" + c.id + "'>" + c.label + "</a>",
				"label" : "<label   class='" + c.labelclass + "'>" + c.label + "</label><br clear='all' /><label id='" + c.id + "' class='" + c.class + "'>" + c.value + "</label>",
				"label2" : "<a id='" + c.id + "' title='" + c.label + "' onClick=\"stopProp(event);" + c.action + "\" class='" + c.class + "'>" + c.value + "</a>",
				"button" : "<input type='button' value='" + c.value + "' onClick=\stopProp(event);" + c.action + "\" class='" + c.class + "'   data-scope='" + c.SourceID + "' data-id='" + c.cleanId + "' name='" + c.id + "' id='" + c.id + "' />",
				"group":"<div class='row-fluid " + c.class + "'>" + c.value + "</div>",
				"groupnowrap":c.value,
				"ts":"<table id='table" + c.id + "' class='span" + c.size + " " + c.class + "'>",
				"te":"</table>",
				"trs":"<tr class='" + c.class + "'>",
				"tre":"</tr>",
				"cs":"<td class='" + c.class + "'>",
				"openline":"<div class='row-fluid'>",
				"closeline":"</div>",
				"ce":"</td>",
				"sep":"<div class='" + c.class + "' style='size:" + c.size + "px;overflow:hidden;'>" + c.value + "</div>",
				"ajaxhtml":"<span id='link" + c.id + "'  data-instruction='ajaxhtml' data-path='" + c.datapath + "' data-param='" + c.dataparam + "' ></span>",
				"pretext":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><div class='input-prepend'><span class='add-on'>"+c.pre+"</span><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  class='span3 pretext' name='" + c.id + "'  id='" + c.id + "' ></div>",
				"posttext":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><div class='input-append'><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  name='" + c.id + "' class='span3 posttext' id='" + c.id + "' ><span class='add-on'>"+c.post+"</span></div>",
				"dynamicselect":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  name='" + c.id + "'  id='" + c.id + "' class='typehead' />",
				"title":"<div class='span" + c.size + " " + c.class + "' >" + c.value + "</div>",
				"textarea":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><textarea size='4' id='" + c.id + "' class='textarea' value='" + c.value + "'>" + c.value + "</textarea>",
				"controlopen":"<div id='wrap" + c.name + c.index + "' data-type='" + c.dataType + "' data-editable='" + c.editable + "' data-table='" + c.table + "' data-db='" + c.db + "' data-field='" + c.field + "' data-index='" + c.index + "' class='span" + c.size + " control " + c.class + "'>",
				"controlclose":"</div>",
				"break":"<div class='row breakrow'><div class='span12 hLine'></div></div>",
				"titlelink":"<a class='span" + c.size + " titleLink " + c.class + "' data-value='" + c.value + "' data-icon='" + c.label + "' href='#' id='catLink" + c.id + "' data-source='" + c.source + "' data-binder='" + c.databinder + "' data-key='" + c.key + "' data-keyId='" + c.keyId + "'  data-target='" + c.target + "' data-id='" + c.id + "'><span class='catIcon' style='background:url(icons/" + c.label + ".png);'></span>" + c.value + "</a>",
				"openform":"<div id='" + c.id + "' class='row-fluid forumRow'><div id='wrapper" + c.id + "' style='width:" + c.size + ";overflow:hidden;' class='span12 sectionHolder" + c.class + "' data-id='" + c.id + "' >",
				"closeform":"</div>",
				"textblock":"<div class='row-fluid'><div id='wrap" + c.name + c.index + "' class='span" + c.size + " offset" + c.offset +  " " + c.class + "' >" + c.value + "</div></div>"
				
		}
			// $.extend(true,eval(elements),eval(customElements))
		return elements[pType.toLowerCase()]
	}
	function setLinks() {
		var tLinks=$(".link")
			tLinks.bind("click",function(event) {
				 event.preventDefault();
					var pThis=$(this)
					var datapackage={
						"keyId":pThis.attr("data-keyId"),
						"primaryKey":$(this).attr("data-id")
					}

			var tSectionId=$(this).attr("data-section")
			$("#children-breadcrum").empty()
			var tHold=$(this).attr("id") 
			$(".link").removeClass("active")
			pThis.addClass("active")
			slideOutLeft(tHold,function(tSectionId) {
				
				$("#wrapper"+tSectionId.split("link").join("")).fadeOut("fast").remove();
					$("#"+tSectionId).animate({
				scrollTop: $("#"+tSectionId.split("link").join("")).offset().top
			  }, 500)
			
			}	)	
				var tTarget=pThis.attr("data-target")
				controlFreak.render(datapackage,tTarget,function(cd) {
				controlFreak.render(cd,cd.doaction,"")
			});
			})
	}
	function setFields() {
		var fields=$("div[data-editable=true] input,div.input-append input,div.input-prepend input,div[data-editable=true] textarea")
		// fields.unbind()
		fields.bind("focus",function() {
			$(this).attr("data-initial",$(this).val())
			$(this).addClass("activeInput")
		})
		fields.bind("blur",function() {
			$(this).removeClass("activeInput")
				if ($(this).val()!=$(this).attr("data-initial")) {
					processUpdate($(this))
				}
			})	
		}

function loadInserts(cd) {

	var contentPath=cd.datapath
	var dataParam=cd.primaryKey
	$("#children-" + cd.container).load(contentPath + "?id=" + dataParam)
		return;

}
			function loadLists() {
			var ajaxUrl="countries.html"
 $.ajax({
      url:ajaxUrl,
		type:"get",
		dataType:'html',
		success:function(data){
        $(".typehead").typeahead({
            source: eval("[" + data + "]")
        })
    }
})
}
	
	
	function processUpdate(pThis) {
	var tThis=pThis.closest("div[data-editable='true']")
	var updatePackage={
		db:tThis.attr("data-db"),
		table:tThis.attr("data-table"),
		field:tThis.attr("data-field"),
		newValue:function() {
				var tReturn=""
						if (pThis.attr("class")=="typehead") {
							tReturn=$('ul.typeahead li.active').data('value');
						} else {
								tReturn=pThis.val()
						}
						return tReturn
				}()
		,
		pk:"memberId",
		valueType:tThis.attr("data-type"),
		fieldId:pThis.attr("id")
	}
	pThis.addClass("updating")
	updateField(updatePackage)
	}
	function updateField(pItem) {
	
	var url="http://baddrunkenbarpoetry.com/ajglobalfieldupdate.asp"

$.ajax({
type: "POST",
url: url,
data: pItem ,
success: function(data) {
		var updated=$("#" + data)
		updated.removeClass("updating")
}
});
}

function iterator(cd,sl,callback2) {


if (cd.source!="") {
			 controlFreak.getData(cd,sl,callback2,function(cd,dd,sl,callback2) {
				var tCallArgument=cd.doaction
						 dd[0].doaction=tCallArgument
						 var tTarget=cd.target
				cd=$(true,cd,dd)
							if ($.isFunction(callback2)==true) {
				callback2(eval(dd[0]))
			}
					 $.each(dd,function(ind,obj) {	
							$.extend(obj, {
								"index":ind,
								"holder":cd.holder
							})
							
					controlFreak.render(eval(obj),tTarget,"")
					})
					sl()	
				})
				} else {
				var tTarget=dd.target
					 $.each(dd,function(_,obj) {
							obj.index=_
					controlFreak.render(eval(obj),tTarget,"")
					})
				}			
}


function getData(cd,sl,callback2,callback) {
var source=cd.source
var pKeyId=cd.keyId
var pKey=cd.key
var pOrder
if (cd.order) {
	pOrder=cd.order
} else {
	pOrder=""
}
 var dataUrl = "http://baddrunkenbarpoetry.com/ajforumsource.asp";
 $.ajax({
      url:dataUrl,
		type:"POST",
		data:{key:pKey,keyId:pKeyId,source:source,order:pOrder},
		dataType:'html',
		success:function(data){ 
		
	var dd=eval(data);
	callback(cd,dd,sl,callback2)
	
}});
}

// animation
function slideOutLeft(tSection,callback) {

	$(".forumRow").not(":has(#" + tSection + ")").each(function(index) {
			$(this).hide('slide',{direction:'right'},1000)
	},callback(tSection))
}


	
	controlFreak = {
		render : drawControl,
		build:draw,
		bindFields:setFields,
		bindLinks:setLinks,
		loadLists:loadLists,
		getData:getData,
		iterate:iterator,
		loadInserts:loadInserts
	};
}
)();
