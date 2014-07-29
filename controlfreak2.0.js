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
	 	

	function init() {


	}
	// main render function
	// if single element is passed, object is defined, merged into type html template, and returned as html for rendering
	// if array of control elements are passed, each control is rendered into html and html for group of controls is returned
	// this allows for grouping and hierarchical sections
	function drawControl(c, pControlArray,callback) {
		if ((pControlArray) && (pControlArray!="undefined")) {
		if (pControlArray.split(",").length>1) {
			var subRender = "";
			$.each(pControlArray.split(","), function (i, val) {
				subRender +=controlFreak.render(c,val,callback);
			})
			return subRender
		} else {
			c=$.extend(true,c, decorate(c, "reset",pControlArray))
			c=$.extend(true,c, decorate(c, pControlArray,""))
			if ((c.clear=="clear")&&(c.container!="")) {
					$("#children-" + c.container).empty()
			}
			if($.isFunction(c.before)) {
				c.before(c);
				return  false
			}
			if (c.type=="iterator") {
				controlFreak.iterate(c,function(c) {
						controlFreak.bindFields();
						if ($.isFunction(c.callbinders)) {
							c.callbinders();
						};
						return controlFreak.bindLinks();
						},callback)		
			} else {
			if (c.type=="ajaxhtml") {
				controlFreak.loadInserts(c);
			} else {
			var tHTML=""
			if (c.wrap=="true") {
				tHTML+=this.build(c,c.open)
			}
			tHTML+= this.build(c,c.type);
			if (c.wrap=="true") {
			tHTML+=this.build(c,c.close)
			}
			if ($.isFunction(c.afterrender)==true) {
					c.afterrender()
			}
			if ((c.paint=="true")&&(c.container!="")) {
			if (c.strictname=="true") {
				$(c.container).append(tHTML)	
				} else {
				$("#children-" + c.container).append(tHTML)	
			}
				if ($.isFunction(callback)==true) {
					callback(c)
				}
				if ((c.prtarget!="")&&(c.postrender=="true")) {
				controlFreak.pr(c);
				}

			} else {
				return tHTML
			}
		}
		}}
		} else {
		return ""
		}
	}
	// **************** html control templates *************

	function draw(c,pType) { // templates
					for (var index in c) {
				if ($.isFunction(c[index])) {
					c[index] = c[index]()
				}
			};
		var elements = {
				"icon":"<a class='icon " + c.class + "' title='" + c.value + "' style='background:url(\"../icons/" + c.label + "\") 0 0 no-repeat transparent;'></a>",
				"textbox" : "<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><input type='text' data-questionId='" + c.questionId + "' data-questiontypeid='1' data-id='" + c.id + "'  value='" + c.value + "'  class='" + c.class + "' name='" + c.id + "'  id='" + c.id + "' />",
				"imagebutton" : "<a  title='" + c.label + "'  data-entity='" + c.Entity + "'  data-level='" + c.level + "' data-scope='" + c.SourceID + "' data-employeeIndex='" + c.employeeIndex + "' data-id='" + c.id + "' onClick=\"" + c.action + "\" class='" + c.class + "' id='" + c.id + "' >" + c.value + "</a>",
				"link2" : "<a class='" + c.class + "' data-axis='" + c.axis + "' data-id='" + c.id + "'  data-target='" + c.prettyUrl + "'  data-keyId='" + c.keyId + "' data-key2Id='" + c.key2Id + "' data-index='" + c.index + "' onClick='" + c.action + "' title='" + c.title + "' href='javascript:void(0)' id='link" + c.id + "'>" + c.label + "</a>",
				"link" : "<a class='" + c.class + "' data-axis='" + c.axis + "' data-id='" + c.id + "' data-section='" + c.id + "' data-target='" + c.prettyUrl + "'   title='" + c.title + "' id='link" + c.id + "'>" + c.label + "</a>",
				"menucategorylink": "<a id='catlink" + c.id + "' data-keyId='" + c.keyId + "' class='" + c.class + "' data-label='" + c.label + "' data-target='" + c.prettyUrl + "'    href='javascript:void(0)' ><div class='" + c.iconclass + "' style='background:url(" + c.icon + ");' ></div>" + c.label + "</a>",
				"label" : "<label   class='" + c.labelclass + "'>" + c.label + "</label><br clear='all' /><label id='" + c.id + "' class='" + c.class + "'>" + c.value + "</label>",
				"label2" : "<a id='" + c.id + "' title='" + c.label + "' data-id='" + c.id + "' onClick=\"" + c.action + "\" class='" + c.class + "'>" + c.value + "</a>",
				"linklabel":"<div class='" + c.labelClass + "'>" + c.label + "</div><a href='javascript:(void)' onclick='" + c.action + "' class='" + c.class + "'>" + c.value + "</a>",
				"button" : "<input type='button' value='" + c.value + "' onClick=\"" + c.action + "\" class='" + c.class + "'   data-keyId='" + c.keyId + "'  name='" + c.id + "' id='" + c.id + "' />",
				"strapbutton":"<button class='span12 btn btn-" + c.class + "' data-id='" + c.id + "' data-threadId='" + c.threadId + "' id='" + c.id + "' data-target='" + c.target + "' data-keyId='" + c.keyId + "' onClick=\"" + c.action + "\" >" + c.value + "</button>",
				"group":"<div class='row-fluid " + c.class + "'>" + c.value + "</div>",
				"wrapclass":"<div class='" + c.class + "'>" + c.value + "</div>",
				"groupnowrap":c.value,
				"ts":"<table id='table" + c.id + "' class='" + c.class + "'>",
				"te":"</table>",
				"trs":"<tr class='" + c.class + "'>",
				"tre":"</tr>",
				"cs":"<td vertical-align='top' class='" + c.class + "'>",
				"cspan":"<td  vertical-align='top' colspan='" + c.colspan + "'  class='" + c.class + "'>",
				"crspan":"<td  vertical-align='top'  rowspan='" + c.rowspan + "'  class='" + c.class + "'>",
				"openline":"<div class='row-fluid'>",
				"closeline":"</div>",
				"ce":"</td>",
				"spacer":"<div class='span" + c.size + " spacer' ></div>",
				"text":"<div id='" + c.id + "' class='" + c.class + "' data-id='" + c.id + "'  >" + c.value + "</div>",
				"labeltext":"<div class='frontLabel " + c.labelclass + "'>" + c.label + "</div><a class='" + c.class + "'>" + c.value + "</a>",
				"sep":"<div class='" + c.class + "' style='size:" + c.size + "px;overflow:hidden;'>" + c.value + "</div>",
				"ajaxhtml":"<span id='link" + c.id + "'  data-instruction='ajaxhtml' data-path='" + c.datapath + "' data-param='" + c.dataparam + "' ></span>",
				"pretext":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><div class='input-prepend'><span class='add-on'>"+c.pre+"</span><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  class='span3 pretext' name='" + c.id + "'  id='" + c.id + "' ></div>",
				"posttext":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><div class='input-append'><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  name='" + c.id + "' class='span3 posttext' id='" + c.id + "' ><span class='add-on'>"+c.post+"</span></div>",
				"dynamicselect":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><br /><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  name='" + c.id + "'  id='" + c.id + "' class='typehead' />",
				"title":"<div class='span" + c.size + " " + c.class + "' >" + c.value + "</div>",
				"textarea":"<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><textarea size='4' id='" + c.id + "' name='" + c.id + "' data-questionId='" + c.questionId + "' data-questiontypeid='3' class='textarea' value='" + c.value + "'>" + c.value + "</textarea>",
				"formtextbox" : "<label for='" + c.id + "' class='" + c.labelclass + "'>" + c.label + "</label><input type='text'  data-id='" + c.id + "'  value='" + c.value + "'  class='" + c.class + "' name='" + c.id + "'  id='" + c.id + "' />",
				"controlopen":"<div id='wrap" + c.name + c.index + "' data-type='" + c.dataType + "' data-editable='" + c.editable + "' data-table='" + c.table + "' data-db='" + c.db + "' data-field='" + c.field + "' data-index='" + c.index + "' class='span" + c.size + " control " + c.class + "'>",
				"controlclose":"</div>",
				"break":"<br clear='all'>",
				"linefeed":"<br clear='all'><br>",
				"titlelink":"<a class='span" + c.size + " titleLink " + c.class + "' data-value='" + c.value + "' data-icon='" + c.label + "' href='#' id='catLink" + c.id + "' data-source='" + c.source + "' data-binder='" + c.databinder + "' data-key='" + c.key + "' data-keyId='" + c.keyId + "'  data-target='" + c.target + "' data-id='" + c.id + "'><span class='catIcon' style='background:url(icons/" + c.label + ".png);'></span>" + c.value + "</a>",
				"openform":"<div id='form" + c.id + "' class='row-fluid forumRow " + c.class + "'><div id='children-wrapper" + c.id + "' class='span12 sectionHolder " + c.class + "' data-id='" + c.id + "' >",
				"closeform":"</div></div>",
				"openform2":"<div id='form" + c.id + "' class='row-fluid forumRow2 " + c.class + "'><div id='children-wrapper" + c.id + "' class='span12 sectionHolder " + c.class + "' data-id='" + c.id + "' >",
				"closeform2":"</div></div>",
				"openformhorizontal":"<span id='" + c.id + "' class='forumColumn'>",
				"closeormhorizontal":"</span>",
				"textblock":"<div class='row-fluid'><div id='wrap" + c.name + c.index + "' class='span" + c.size + " offset" + c.offset +  " " + c.class + "' >" + c.value + "</div></div>",
				"menulink":"<li><a class='" + c.class + "' data-axis='" + c.axis + "' data-id='" + c.id + "'  data-target='" + c.prettyUrl + "'  data-keyId='" + c.keyId + "' data-key2Id='" + c.key2Id + "'  title='" + c.label + "' href='javascript:void(0)' onclick='" + c.action + "' id='link" + c.id + "'><div class='" + c.iconclass + "' style='height:32px;width:32px;overflow:hidden;display:inline-block;background:url(\"http://baddrunkenbarpoetry.com/icons/" + c.icon + "\") 0 0 no-repeat transparent;' ></div>" + c.label + "</a></li>",
				"select":"<label for='" + c.id + "' class='frontLabel " + c.labelclass + "'>" + c.label + "</label><select name='" + c.id + "' id='" + c.id + "' data-questionId='" + c.questionId + "' data-questiontypeid='2' data-keyId='" + c.keyId + "' value='" + c.value + "' >" + c.firstoption + "</select>",
				"option":"<option value='" + c.value + "'>" + c.label + "</option>",
				"tooltip":"<a class='tooltip' href='#' >" + c.value + "</a>"		
		}
		return elements[pType.toLowerCase()]
	}
	function resolveTarget(event) {
					var pThis=$(event.target)
					var datapackage={
						"keyId":pThis.attr("data-keyId"),
						"key2Id":pThis.attr("data-key2Id"),
						"value":pThis.attr("data-value"),
						"target":pThis.attr("data-target"),
						"heading":pThis.attr("data-label")
					}
					$("#children-breadcrums").empty()
					$("#children-breadcrums").append(datapackage.heading)
				var tTarget=datapackage.target
				controlFreak.render(datapackage,tTarget,"")
	}
	function setLinks() {
		var tLinks=$(".link")
			$(".forumRow.linked").unbind()
			$(".forumRow.linked").bind("click",function(e) {
				    var $link = $(this).find(".link");

    if (e.target === $link[0]) return false;

    $link.trigger('click');
    return false;
			})
			tLinks.unbind();
			tLinks.bind("click",function(event) {
				 event.preventDefault();
					var pThis=$(this)
					var datapackage={
						"target":$(this).attr("data-target"),
						"keyId":$(this).attr("data-keyId")
					}
			$(".link").removeClass("active")
			pThis.addClass("active")
			$(document).scrollTo("top");
			
			//	$(".forumRow").hide( "drop", { direction: "down" }, "slow");
				controlFreak.go(datapackage,datapackage.target);
			})
	}
	function postRender(cd) {
				controlFreak.render(cd,cd.prtarget,"")
	}
	function setFields() {
		var fields=$("div[data-editable=true] input,div[data-editable=true] select,div[data-editable=true] textarea")
		fields.unbind()
		fields.bind("focus",function() {
			$(this).attr("data-initial",$(this).val())
			$(this).addClass("activeInput")
		})
		fields.bind("blur",function() {
			$(this).removeClass("activeInput")
				if ($(this).val()!=$(this).attr("data-initial")) {
					controlFreak.procupdate($(this))
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
		var questionId=pThis.attr("data-questionId")
		var questionTypeId=pThis.attr("data-questiontypeid")
		var id=pThis.prop("id")
		var answerMemo="none"
		var answerText="none"
		var assignmentId=0
						switch ( parseInt(questionTypeId)) {
							case 1:
								answerText=pThis.prop("value");
							break;
							case 2:
								assignmentId=pThis.val();
							break;
							case 3:
								answerMemo=pThis.prop("value");
						}
	var updateDataPackage={
				assignmentId:assignmentId,
				answerMemo:answerMemo,
				answerText:answerText,
				questionId:questionId,
				qTypeId:questionTypeId,
				id:id
				}
	pThis.addClass("updating")
	controlFreak.update(updateDataPackage)
	}
	function updateField(pItem) {
	var url="http://baddrunkenbarpoetry.com/allquestionprocessing.asp"
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
	//	$("#glass").show().animate({
         //           top: 100,
         //       }, 600,"easeOutExpo");
				controlFreak.getData(cd,sl,callback2,function(cd,dd,sl,callback2) {
					var tTarget=cd.target
					if (cd.actionfirstdecorater!="") {
						$.extend(true,cd, decorate(dd[0], cd.actionfirstdecorater,""))
							cd.actiononfirst(cd)
					}
					 $.each(dd,function(ind,obj) {	
						controlFreak.render(obj,tTarget,"")
					})
					if ($.isFunction(cd.callback)==true) {
						cd.callback()
					};
							if ((cd.doaction!="undefined")&&(cd.doaction!="")) {
									dd[0].doaction=cd.doaction;
								if ($.isFunction(callback2)==true) {
									callback2(dd[0])
								} else {
									controlFreak.render(dd[0],dd[0].doaction,"")
								}
							}
					sl(cd);
				})
}
	function showReply(event) {
		var obj=$(event.target)
		obj.addClass("disabled")
		obj.attr("disabled","disabled")
		var targetPostId=obj.attr("id")
		var c={}
		c= objFromControl(c,obj)
		controlFreak.render(c,"replyform",function(c) {
		$("#postPane").insertAfter($("#form" + c.id2))
		var threadId=c.threadId
		controlFreak.makeEditor("post",threadId)
		})
		}
	function buildEditor(pType,pThreadId) {
		var editor=CKEDITOR.replace("postPane",
				{
					uiColor: '#F89406'
			})
			editor.config.extraAllowedContent = 'img[src,alt,width,height]'
			 editor.on( 'pluginsLoaded', function( ev )
         {
		 var savePost
		 if (pType=="post") {
		 savePost = { exec: function(p) {
			var pData={
				newPostText:CKEDITOR.instances.postPane.getData() ,
				threadId:pThreadId
			}
			controlFreak.savePostData(pData,function() {
				$(window).trigger("popstate")
			})
		}
		}
		} else {
			savePost = { exec: function(p) {
			var pData={
				textarea:CKEDITOR.instances.postPane.getData() ,
				topicId:$("#children-newthreadcategoryid").val(),
				threadsecuritylevelId:$("#children-newthreadsecuritylevelid").val(),
				threadtitle:$("#newthreadheading").val()
			}
			controlFreak.saveThreadData(pData,function(pUrl) {
				controlFreak.go("",pUrl)
			})
		}
		}
		}
	 var upload = { exec: function(p) {
			grabFile(memberId,10,securityLevel);
		}
		}
		
		var selectimage = { exec: function(p) {
			insertFromBucket();
		}
		}
           // Register the command used to open the dialog.
           editor.addCommand( 'savePostAddCmd', savePost );
		    editor.addCommand( 'uploadAddCmd', upload );
			 editor.addCommand( 'selectAddCmd', selectimage );
		           editor.ui.addButton( 'Upload Image',
                    {
                        label : 'Upload Image',
                        command : 'uploadAddCmd',
                        icon : 'http://baddrunkenbarpoetry.com/icons/imagesicon16.png'
                    } ),
				editor.ui.addButton( 'Select Image',
                    {
                        label : 'Select Image',
                        command : 'selectAddCmd',
                        icon : 'http://baddrunkenbarpoetry.com/icons/drunkfun16.png'
                    } ),
					  editor.ui.addButton( 'Save Image',
                    {
                        label : 'Save and Post',
                        command : 'savePostAddCmd',
                        icon : 'http://baddrunkenbarpoetry.com/icons/bdbp16.png'
                    } )				
});
			}
function savePostData(pData,callback) {
var url="http://baddrunkenbarpoetry.com/inc/ajaddnewpost.asp"
$.ajax({
type: "POST",
url: url,
data: pData,
success: function(data) {
		callback()
}
});
}
function saveThreadData(pData,callback) {
var url="http://baddrunkenbarpoetry.com/inc/ajaddnewthread.asp"
$.ajax({
type: "POST",
url: url,
data: pData,
success: function(data) {
		callback(data)
}
});
}
function objFromControl(pObj,pElement) {
	var tempC={
		"id":pElement.attr("data-id"),
		"threadId":pElement.attr("data-threadId")
	}
	return $.extend(pObj,tempC)
	}
function getData(cd,sl,callback2,callback) {
var source=cd.source
var pKeyId=cd.keyId
var pKey=cd.key
var src=cd.src
var pOrder
var dPackage
if (cd.order) {
	pOrder=cd.order
} else {
	pOrder=""
}
var dataUrl = "http://baddrunkenbarpoetry.com/ajforumsource.asp";
if ((cd.sql!="")&&(cd.sql!="undefined")&&(cd.sql)) {
dataUrl= "http://baddrunkenbarpoetry.com/ajsqldatalookup.asp";
dPackage={sql:cd.sql}
} else {
dPackage={
		key:pKey,
		keyId:pKeyId,
		source:source,
		order:pOrder,
		src:src
		}
}

 $.ajax({
      url:dataUrl,
		type:"POST",
		async: false,
		data:dPackage,
		dataType:'html',
		success:function(data){ 
		
	var dd=eval(data);
	callback(cd,dd,sl,callback2)
}});
}
function checkState() {
var turl
turl=window.location.pathname 
turl=turl.substring(1,turl.length)
controlFreak.getTargetPageData(turl,function(data) {
var iterator3=controlFreak.lookupTarget(data.type)
$.extend(true,data, {
			pageUrl:turl
})
controlFreak.render(data,iterator3,'')
})
}
function getTargetData(pUrl,callback) {
var dataUrl="http://baddrunkenbarpoetry.com/ajprettyurllookup.asp"
 $.ajax({
      url:dataUrl,
		type:"POST",
		data:{pUrl:pUrl},
		dataType:'html',
		success:function(data){ 	
	var dd=eval(data);
	callback(dd[0])
}});
}
function recordAction(cd) {
var dataUrl="http://baddrunkenbarpoetry.com/ajactionrecorder.asp"
 $.ajax({
      url:dataUrl,
		type:"POST",
		data:cd,
		async: true,
		dataType:'html',
		success:function(data){ 
}});
}
function changeUrl(c,pUrl) {
	window.history.pushState({},'',"/" + pUrl) 
	$(window).trigger("popstate")
}
function showinwindow(src) {
    $.lightbox(html, {
	href:src
  });
	}
function lookupTarget(pType) {
var targets= {
"forums":"forum",
"forum":"forumtopics",
"topic":"forumthreads",
"threads":"threadposts",
"menu":"menucategories",
"bdbp":"golink",
"'menucategoryitem":"menucategories",
"questions":"questioncategories",
"questioncategoryitems":"categoryprofilequestions",
"questionoptions":"questionoptions",
"memberposts":"memberposts"
}
return targets[pType]
}
	controlFreak = {
		render : drawControl,
		build:draw,
		bindFields:setFields,
		bindLinks:setLinks,
		loadLists:loadLists,
		getData:getData,
		iterate:iterator,
		loadInserts:loadInserts,
		showReply:showReply,
		goTarget:resolveTarget,
		pop:showinwindow,
		pr:postRender,
		update:updateField,
		procupdate:processUpdate,
		checkState:checkState,
		getTargetPageData:getTargetData,
		go:changeUrl,
		lookupTarget:lookupTarget,
		savePostData:savePostData,
		saveThreadData:saveThreadData,
		makeEditor:buildEditor,
		recordAction:recordAction
	};
}
)();
