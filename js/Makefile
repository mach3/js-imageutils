SRC=imageutils.js
MIN=imageutils.min.js

all : $(MIN)

$(MIN) : $(SRC)
	yuic $< > $@

clean :
	rm -rf $(MIN)
