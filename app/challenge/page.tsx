'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Navigation from "@/components/Navigation";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";

// Product data
const products = [
  { name: "product1", category: "category1", price: "$99.99" },
  { name: "product2", category: "category3", price: "$149.99" },
  { name: "product3", category: "category2", price: "$79.99" },
  { name: "product4", category: "category5", price: "$199.99" },
  { name: "product5", category: "category1", price: "$89.99" },
  { name: "product6", category: "category4", price: "$129.99" },
  { name: "product7", category: "category2", price: "$159.99" },
  { name: "product8", category: "category3", price: "$119.99" },
  { name: "product9", category: "category5", price: "$139.99" },
  { name: "product10", category: "category4", price: "$109.99" },
];

const Challenge = () => {
  const [productInput, setProductInput] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const [resultPrice, setResultPrice] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [fieldOrder, setFieldOrder] = useState<"product-first" | "category-first">("product-first");
  const [fieldIds, setFieldIds] = useState({
    productInput: "product-input-1",
    categorySelect: "category-select-1",
    searchBtn: "search-btn-1",
    cleanBtn: "clean-btn-1",
  });

  const generateRandomIds = () => {
    const timestamp = Date.now();
    setFieldIds({
      productInput: `product-input-${timestamp}`,
      categorySelect: `category-select-${timestamp}`,
      searchBtn: `search-btn-${timestamp}`,
      cleanBtn: `clean-btn-${timestamp}`,
    });
  };

  const downloadExcel = () => {
    const data = products.map(p => ({
      product: p.name,
      category: p.category,
      price: "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "rocketbot_challenge.xlsx");

    toast.success("Excel file downloaded successfully!");
  };

  const handleSearch = () => {
    const foundProduct = products.find(
      p => p.name.toLowerCase() === productInput.toLowerCase().trim()
    );

    if (foundProduct) {
      setResultPrice(foundProduct.price);
      setAttempts(prev => prev + 1);

      if (foundProduct.category === categorySelect) {
        setCorrect(prev => prev + 1);
        toast.success("Correct match!");
      } else {
        toast.error("Product found but category doesn't match");
      }
    } else {
      setResultPrice("Product not found");
      setAttempts(prev => prev + 1);
      toast.error("Product not found");
    }

    // Randomly change field order
    setFieldOrder(Math.random() > 0.5 ? "product-first" : "category-first");
  };

  const handleClean = () => {
    setProductInput("");
    setCategorySelect("");
    setResultPrice("");
    generateRandomIds();
  };

  const successRate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  return (

    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 mx-auto">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RPA Challenge
            </h1>
            <p className="text-lg text-muted-foreground">
              Test your automation skills by completing product lookups
            </p>
          </div>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Download Challenge Data</CardTitle>
              <CardDescription>
                Download the Excel file with product information to begin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadExcel} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Excel File
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Product Lookup Form</CardTitle>
              <CardDescription>
                Enter product name and select category to find the price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fieldOrder === "product-first" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={fieldIds.productInput}>Product Name</Label>
                    <Input
                      id={fieldIds.productInput}
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      placeholder="Enter product name (e.g., product1)"
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldIds.categorySelect}>Category</Label>
                    <Select value={categorySelect} onValueChange={setCategorySelect}>
                      <SelectTrigger id={fieldIds.categorySelect}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category1">Category 1</SelectItem>
                        <SelectItem value="category2">Category 2</SelectItem>
                        <SelectItem value="category3">Category 3</SelectItem>
                        <SelectItem value="category4">Category 4</SelectItem>
                        <SelectItem value="category5">Category 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={fieldIds.categorySelect}>Category</Label>
                    <Select value={categorySelect} onValueChange={setCategorySelect}>
                      <SelectTrigger id={fieldIds.categorySelect}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category1">Category 1</SelectItem>
                        <SelectItem value="category2">Category 2</SelectItem>
                        <SelectItem value="category3">Category 3</SelectItem>
                        <SelectItem value="category4">Category 4</SelectItem>
                        <SelectItem value="category5">Category 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldIds.productInput}>Product Name</Label>
                    <Input
                      id={fieldIds.productInput}
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      placeholder="Enter product name (e.g., product1)"
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button
                  id={fieldIds.searchBtn}
                  onClick={handleSearch}
                  disabled={!productInput || !categorySelect}
                  className="flex-1"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button
                  id={fieldIds.cleanBtn}
                  onClick={handleClean}
                  variant="outline"
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clean
                </Button>
              </div>

              {resultPrice && (
                <div className="rounded-lg border bg-muted p-4">
                  <p className="text-sm font-medium text-muted-foreground">Price Result:</p>
                  <p className="text-2xl font-bold text-primary">{resultPrice}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-muted">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate:</span>
                  <span className="text-3xl font-bold text-primary">{successRate}%</span>
                </div>
                <div className="h-4 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Attempts: {attempts}</span>
                  <span>Correct: {correct}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  );
};

export default Challenge;
