let user_ans = {
    "1":{
        "num_dropped" :0,
        "dropped_color": []
    },
    "2":{
        "num_dropped" :0,
        "dropped_color" : []
    }
}
let fullfilled = 0
$(document).ready(function(){
    let container = $("#interactive");
    let c1 = $("<div class='col-6'></div>")
    container.append(c1);
    let c2 = $("<div class='col-6'></div>")
    container.append(c2);
    let painting = $('<div>');
    painting.attr("class", "quiz-image");
    painting.append("<img src='../../../static/images/"+media.url+"'>");
    c1.append(painting);
    let r2 = $("<div class='row'></div>");
    c2.append(r2);
    media.colors.forEach(color => {
        let c3 = $("<div class='col-4'></div>");
        let circle = $("<div class='color_circle'></div>");
        circle.attr("style","background:"+color+";");
        circle.attr("data-color",color);
        $(circle).draggable({
            cursor: "move",
            revert: true,
            stack: ".color_circle",
            helper: "clone",
        })
        $(circle).mouseover(function() {
            $(this).addClass("circle-on-hover")
        })
        $(circle).mouseout(function() {
            $(this).removeClass("circle-on-hover")
        })

        c3.append(circle);
        r2.append(c3);
    });
    let r3 = $("<div class='row'></div>");
    c2.append(r3);
    r3.append("<div class='col-4 sm_drag_circle' data-id = '1'>drop two complementary colors here</div>");
    r3.append("<div class='col-4 sm_drag_circle' data-id = '2'>drop two complementary colors here</div>")
    


    $(".sm_drag_circle").droppable({
        tolerance: "fit",
        accept: ".color_circle",
        drop: function(event, ui) {
                let temp = $(ui.helper).clone();
                $(this).append(temp);
                let id = event.target.dataset.id;
                user_ans[id]['num_dropped']+= 1
                user_ans[id]['dropped_color'].push(ui.helper[0].dataset.color);
                console.log(user_ans)
                if (user_ans[id]['num_dropped'] == 2) {
                    $(this).droppable('disable');
                    fullfilled+=1;
                }
                if( fullfilled == 2){
                    let data = {};
                    data['section'] = ans_section;
                    data['answer'] = [user_ans["1"]['dropped_color'],user_ans["2"]['dropped_color']];
                    console.log(data['answer']);
                    $.ajax({
                        type: "POST",
                        url: "../../../update_ans",                
                        dataType : "json",
                        contentType: "application/json; charset=utf-8",
                        data : JSON.stringify(data),
                        success: function(result){
                            $('span.right_footnote').html("Score: "+result.data["score"]+"/10");
                        },
                        error: function(request, status, error){
                            console.log("Error");
                            console.log(request)
                            console.log(status)
                            console.log(error)
                        }
                    })
            }
        }
    });
})