// control freak 1.0
// author David R Wallace
// requires libraries: jquery, conrolFreaksLibrary.js,customFreaksLibrary.js


var controlFreak;

(function () {

	var customElements = ""
	 	

	function init() {
	// main render function
	// if single element is passed, object is defined, merged into type html template, and returned as html for rendering
	// if array of control elements are passed, each control is rendered into html and html for group of controls is returned
	// this allows for grouping and hierarchical sections
	function drawControl(c, pControlArray) {
		if (pControlArray.split(",").length>1) {
			var subRender = "";
			$.each(pControlArray.split(","), function (i, val) {
				subRender +=controlFreak.render(c,val);
			})
			return subRender
		} else {
			c=$.extend(true,c, decorate(c, "reset",pControlArray))
			var cc=$.extend(true,c, decorate(c, pControlArray))
			
			c.id = c.name + c.index;
			var tHTML=""
			if (cc.wrap=="true") {
				tHTML+=this.build(cc,cc.open)
			}
			tHTML+= this.build(cc,cc.type);
			if (cc.wrap=="true") {
			tHTML+=this.build(cc,cc.close)
			}
			
			if ((cc.paint=="true")&&(cc.container!="")) {
				$("#" + cc.container).html(tHTML)
			} else {
				return tHTML
			}
		}
	}


	// **************** html control templates *************

	function draw(c,pType) { // templates
		var elements = {
			
				"textbox" : "<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  name='" + c.id + "'  id='" + c.id + "' />",
				"imagebutton" : "<a  title='" + c.label + "'  data-entity='" + c.Entity + "'  data-level='" + c.level + "' data-scope='" + c.SourceID + "' data-employeeIndex='" + c.employeeIndex + "' data-id='" + c.id + "' onClick=\"stopProp(event);" + c.action + "\" class='" + c.class + "' id='" + c.id + "' >" + c.value + "</a>",
				"link" : "<a class='" + c.class + "' href='" + c.value + "' id='" + c.id + "'>" + c.label + "</a></div>",
				"label" : "<label   class='" + c.labelclass + "'>" + c.label + "</label><br clear='all' /><label id='" + c.id + "' class='" + c.class + "'>" + c.value + "</label>",
				"label2" : "<a id='" + c.id + "' title='" + c.label + "' onClick=\"stopProp(event);" + c.action + "\" class='" + c.class + "'>" + c.value + "</a>",
				"button" : "<input type='button' value='" + c.value + "' onClick=\stopProp(event);" + c.action + "\" class='" + c.class + "'   data-scope='" + c.SourceID + "' data-id='" + c.cleanId + "' name='" + c.id + "' id='" + c.id + "' />",
				"threadtitle":"<a href='' class'" + c.class + "' id='" + c.field + c.index + "'>"+c.value + "</a>",
				"group":"<div class='row-fluid " + c.class + "'>" + c.value + "</div>",
				"groupnowrap":c.value,
				"title":"<span class='" + c.class + "' style='background:url(icons/" + c.label + ".png);'></span>"+c.value,
				"textarea":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><textarea size='4' class='textarea' value='" + c.value + "'>" + c.value + "</textarea>",
				"controlopen":"<div id='wrap" + c.name + c.index + "' data-type='" + c.dataType + "' data-editable='" + c.editable + "' data-table='" + c.table + "' data-db='" + c.db + "' data-field='" + c.field + "' data-index='" + c.index + "' class='span" + c.size + " control " + c.class + "'>",
				"controlclose":"</div>",
				"break":"</div><div class='row breakrow'><div class='span12 hLine'></div></div><div class='row'>",
				"navlink":"<a class='list-group-item categoryLink " + c.class + "' data-value='" + c.value + "' data-icon='" + c.label + "' href='#' id='catLink" + c.id + "' data-target='" + c.target + "' data-id='" + c.id + "'><span class='catIcon' style='background:url(icons/" + c.label + ".png);'></span>" + c.value + "</a><br clear='all' />"
		}
			// $.extend(true,eval(elements),eval(customElements))
		return elements[pType.toLowerCase()]
	}
	function setLinks() {
		var tLinks=$(".categoryLink")
		tLinks.bind("click",function() {
			getData(memId,$(this),function(dd,pThis) {
			$(".categoryLink").removeClass("active")
			pThis.addClass("active")
			var tTarget=pThis.attr("data-target")
			controlFreak.render(dd,tTarget);
			})
		})
	}
	function setFields() {
		var fields=$("div[data-editable=true] input,div[data-editable=true] textarea")
		fields.unbind()
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
	
	function processUpdate(pThis) {
	var tThis=pThis.parent()
	var updatePackage={
		db:tThis.attr("data-db"),
		table:tThis.attr("data-table"),
		field:tThis.attr("data-field"),
		newValue:pThis.val(),
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
	
	
	controlFreak = {
		render : drawControl,
		initialize : init,
		build:draw,
		bind:setFields,
		bindLinks:setLinks
	};
}
)();
