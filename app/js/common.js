$(function() {
	var activeMonth = new Date();
	const MAX_marked = 35;
	const MAX_STARS = 5;
	const DEFAULT_STAR_COLOR = '#b3b3b3';
	const MY_URL = 'http://promo.fabiohome.ru/test'; 
	const PROXY = 'https://cors-anywhere.herokuapp.com/';

	function GetRates()
	{
		if($(".rating").length != 0)
			$(".rating").remove();
			
		$.ajax({ 
			url: PROXY + MY_URL, 
			type: 'POST',
			data: GetAjaxParam(),
			dataType: 'json',
			success: setDataToPage
		});
	}

	function GetStartDateOnPage(date)
	{
		var res = new Date(date.getFullYear(), date.getMonth(), 1);
		var weekNum = (res.getDay() == 0) ? 6 : res.getDay() - 1;
		res.setDate(res.getDate() - weekNum);
		return res;
	}

	function GetEndDateOnPage(date)
	{
		var res = new Date(GetStartDateOnPage(date));
		res.setDate(res.getDate() + MAX_marked - 1);
		return res;
	}

	function GetAjaxParam()
	{
		var beginD = GetStartDateOnPage(activeMonth);
		var endD = GetEndDateOnPage(activeMonth);
		var startM = beginD.getMonth() + 1 ;
		var endM = endD.getMonth() + 1 ;

		var first =  '' + beginD.getFullYear() + '/'
		+ ((startM < 10) ? ('0' + startM) : startM) + '/' 
		+ ((beginD.getDate() < 10) ? ('0' + beginD.getDate()) : beginD.getDate());
		var last =  '' + endD.getFullYear() + '/'
		+ ((endM < 10) ? ('0' + endM) : endM)+ '/' 
		+ ((endD.getDate() < 10) ? ('0' + endD.getDate()) : endD.getDate());
		return {begin : first, end : last};
	}
	
	function setDataToPage(data){
		if(data.length === 0)
			return;
		var days =  GetDays(activeMonth);
		var marked = data.map(function(obj){return (new Date(obj.data))});
		var dateIdx = 0;
		for(var i=0; i<= days.length; ++i)
		{
			if(dateIdx >= marked.length)
				return;
			if(marked[dateIdx].getDate() === days[i].getDate()
			&& marked[dateIdx].getMonth() === days[i].getMonth()
			&& marked[dateIdx].getFullYear() === days[i].getFullYear())
			{
				CreateStars(data[dateIdx].rate, data[dateIdx].color, i);
				++dateIdx;
			}
		}
	}

	function CreateStars(coloredStarCount, color, idxInTable)
	{
		var res = '<div class="rating">';
		for(var i = 0; i < MAX_STARS; ++i)
		{
			if(i < MAX_STARS - coloredStarCount)
			{
				res += '<span style="color:' + DEFAULT_STAR_COLOR + ';">&#9733</span>';
				continue;
			}
			res += '<span style="color:' + color + ';">&#9733</span>';
		}
		res += '</div>'
		var rateNode = $.parseHTML(res);
		if($($('.table__text').get(idxInTable)).children('.rating').length != 0)
		{
			$($($('.table__text').get(idxInTable)).children('.rating')).replaceWith(rateNode);
		}
		else
		{
			$($('.table__text').get(idxInTable)).append(rateNode);
		}
	} 

	function GetNameMonthPlusYear(date)
	{
		var mNames = ['Январь','Февраль','Март',
						'Апрель','Май','Июнь',
						'Июль','Август','Сентябрь',
						'Октябрь','Ноябрь','Декабрь'];
		return mNames[date.getMonth()] + ' ' + date.getFullYear();
	}

	function GetNextMonth(date)
	{
		if (date.getMonth() == 11) {
			return new Date(date.getFullYear() + 1, 0, 1);
		} else {
			return new Date(date.getFullYear(), date.getMonth() + 1, 1);
		}
	}
	function GetPrevMonth(date)
	{
		if (date.getMonth() == 0) {
			return new Date(date.getFullYear() - 1, 11, 1);
		} else {
			return new Date(date.getFullYear(), date.getMonth() - 1, 1);
		}
	}

	function GetDays(date)
	{
		var res = [];
		var start = GetStartDateOnPage(date);
		var end = GetEndDateOnPage(date);
		for(let i = 0; i < MAX_marked; ++i)
		{
			var toAdd = new Date(start);
			toAdd.setDate(toAdd.getDate() + i);
			res.push(toAdd);
		}
		return res;
	}

	function FillDatesOnPage(dateArr)
	{
		var today = new Date();
		$('.table__text > span').each(function(i)
		{
			$(this).text(dateArr[i].getDate());
			if(activeMonth.getFullYear() === today.getFullYear()
				&& activeMonth.getMonth() === today.getMonth()
				&& dateArr[i].getDate() === today.getDate())
			{
				$(this).addClass("table__item_header_text");
				$(this).parent().parent().addClass("table__item_header");
			} else if($(this).hasClass("table__item_header_text"))
			{
				$(this).removeClass("table__item_header_text");
				$(this).parent().parent().removeClass("table__item_header");
			}
		});
		$('.nav__text').text(GetNameMonthPlusYear(activeMonth));
		GetRates();
	}

	$('.nav__swith_right').on('click', function()
	{
		activeMonth = GetNextMonth(activeMonth);
		FillDatesOnPage(GetDays(activeMonth));
	});

	$('.nav__swith_left').on('click', function()
	{
		activeMonth = GetPrevMonth(activeMonth);
		FillDatesOnPage(GetDays(activeMonth));
	});

	$('.button_sm').on('click', function()
	{
		FillDatesOnPage(GetDays(activeMonth));			
	});

	FillDatesOnPage(GetDays(activeMonth));	
});

