package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
)

func readFile() []string {
	file, err := ioutil.ReadFile("../input")
	if err != nil {
		log.Fatalln("Can't read the input file")
	}

	return strings.Split(string(file), "")
}

func main() {
	fileContent := readFile()
	fileLength := len(fileContent)
	halfCheckFactor := fileLength / 2
	var sum int

	checkIndexes := func(a int, b int) bool {
		fmt.Printf("%d %d %s %s \n", a, b, fileContent[a], fileContent[b])
		return fileContent[a] == fileContent[b]
	}

	for i := 0; i < halfCheckFactor; i++ {
		if checkIndexes(i, i+halfCheckFactor) {
			addedNumber, _ := strconv.Atoi(fileContent[i])
			sum = sum + addedNumber
		}
	}

	fmt.Printf("Sum is equal to %d ", sum*2)
}
