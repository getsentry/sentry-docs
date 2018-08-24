
Jekyll::Hooks.register :site, :pre_render, priority: :low do |site|
  def treeFor(docs, root)
    tree = []

    groups = docs.group_by do |doc|
      doc.relative_path.gsub(root, '').split('/').first
    end

    groups.each do |name, docs_for_group|
      new_root = if root.empty?
        "#{name}/"
      elsif !name.include? "."
        "#{root}#{name}/"
      else
        nil
      end

      document = if new_root
        docs_for_group.detect {|doc| doc.path.include? "#{new_root}index."}
      else
        docs_for_group.detect {|doc| doc.path.include? "#{root}#{name}"}
      end

      docs_without_index = docs_for_group.reject {|doc| doc.path.include? "#{new_root}index." }

      items = new_root.nil? ? nil : treeFor(docs_without_index, new_root)

      if !items.nil?
        items.sort_by! do |i|
          n = if !i["document"].nil? && i["document"].data["sidebar_order"]
            i["document"].data["sidebar_order"]
          else
            1000
          end
        end
      end

      hash = {
        "slug" => name,
        "name" => document.nil? ? name : document.data["title"],
        "document" => document.nil? ? nil : document,
        "items" => items,
        "parent_path" => new_root
      }

      tree.push hash
    end
    tree
  end


  mapped = site.collections.map {|c| c[1].docs}
  documents = mapped.flatten()
  tree = treeFor(documents, "")

  tree.each do |collection|
    config_slug = "#{collection["name"]}_categories"
    config_slug[0] = ""

    if (config = site.data[config_slug])
      collection["items"].sort_by! do |item|
        i = if (cat = config.find_index {|i| i["slug"].eql? item["slug"]})
          cat
        else
          0
        end
        i
      end
    end
  end

  site.config["document_tree"] = tree
end
