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
	fileLength := len(fileContent) - 1
	var sum int

	checkIndexes := func(a int, b int) bool {
		return fileContent[a] == fileContent[b]
	}

	for i := 0; i <= fileLength; i++ {
		if i == fileLength {
			if checkIndexes(0, fileLength) {
				firstNumber, _ := strconv.Atoi(fileContent[0])
				sum = sum + firstNumber
			}
		} else {
			if checkIndexes(i, i+1) {
				addedNumber, _ := strconv.Atoi(fileContent[i])
				sum = sum + addedNumber
			}
		}
	}

	fmt.Printf("Sum is equal to %d ", sum)
}
